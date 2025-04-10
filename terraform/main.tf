terraform {
  backend "s3" {
    bucket         = ""
    key            = ""
    region         = ""
    use_lockfile   = true
  }
}

locals {
  name_prefix = "${var.company_name}-${var.project_name}-${terraform.workspace}"
  function_name = "${local.name_prefix}-function"

  common_tags = {
    Project     = var.project_name
    Environment = terraform.workspace
    ManagedBy   = "Terraform"
    Company     = var.company_name
  }

  files_include = setunion([for f in var.path_include : fileset(var.source_path, f)]...)
  files_exclude = setunion([for f in var.path_exclude : fileset(var.source_path, f)]...)
  files         = sort(setsubtract(local.files_include, local.files_exclude))
  dir_sha       = sha1(join("", [for f in local.files : filesha1("${var.source_path}/${f}")]))
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "this" {}
data "aws_ecr_authorization_token" "token" {}

provider "docker" {
  registry_auth {
    address  = format("%v.dkr.ecr.%v.amazonaws.com", data.aws_caller_identity.this.account_id, var.aws_region)
    username = data.aws_ecr_authorization_token.token.user_name
    password = data.aws_ecr_authorization_token.token.password
  }
}


module "docker_build" {
  source = "terraform-aws-modules/lambda/aws//modules/docker-build"

  create_ecr_repo = true
  ecr_repo        = "${local.name_prefix}-ecr"
  ecr_repo_lifecycle_policy = jsonencode({
    "rules" : [
      {
        "rulePriority" : 1,
        "description" : "Keep only the last ${var.ecr_repo_max_images} images",
        "selection" : {
          "tagStatus" : "any",
          "countType" : "imageCountMoreThan",
          "countNumber" : var.ecr_repo_max_images
        },
        "action" : {
          "type" : "expire"
        }
      }
    ]
  })

  ecr_repo_tags = local.common_tags

  use_image_tag = false

  source_path = var.source_path
  platform    = var.docker_platform

  triggers = {
    dir_sha = local.dir_sha
  }
}


module "lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "7.2.0"

  function_name = local.function_name
  description   = "Lambda function containing the logic to process requests from the API Gateway"

  create_package = false

  # Container Image
  package_type  = "Image"
  architectures = ["x86_64"]
  image_uri     = module.docker_build.image_uri
  
  # Increase timeout for potentially long AI calls
  timeout = 10

  # Add CloudWatch Logs permissions
  attach_policy_json = true
  policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = [
          "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.this.account_id}:log-group:/aws/lambda/${local.function_name}:*",
          "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.this.account_id}:log-group:/aws/lambda/${local.function_name}"
        ]
      }
    ]
  })

  cloudwatch_logs_retention_in_days = var.log_retention_days

  environment_variables = {
    ENVIRONMENT             = terraform.workspace
    BACKEND_CORS_ORIGINS    = var.backend_cors_origins
    MAPS_API_KEY            = var.maps_api_key
    AI_API_KEY              = var.ai_api_key
    AI_MODEL                = var.ai_model
    POPULAR_DISHES_PROMPT   = var.popular_dishes_prompt
    RECAPTCHA_SECRET_KEY    = var.recaptcha_secret_key
    RECAPTCHA_ENABLED       = var.recaptcha_enabled    
  }
  
  tags = local.common_tags
}

module "apigateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "~> 1.1"

  name          = "${local.name_prefix}-gateway"
  protocol_type = "HTTP"

  create_api_domain_name = false

  integrations = {
    "$default" = {
      lambda_arn = module.lambda_function.lambda_function_arn
    }
  }
  
  tags = local.common_tags
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_function.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.apigateway.apigatewayv2_api_execution_arn}/*/$default"
}
