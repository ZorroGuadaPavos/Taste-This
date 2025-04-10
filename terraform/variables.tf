variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Name of the project, used for resource naming"
  type        = string
  default     = "tastethis"
}

variable "company_name" {
  description = "The name of the company"
  type        = string
  default     = "dijkwater"
}

variable "source_path" {
  description = "Path to the Lambda function source code"
  type        = string
  default     = "../backend"
}

variable "path_include" {
  description = "Patterns to include when packaging Lambda function"
  type        = list(string)
  default     = ["**"]
}

variable "path_exclude" {
  description = "Patterns to exclude when packaging Lambda function"
  type        = list(string)
  default     = ["**/__pycache__/**"]
}


variable "ecr_repo_max_images" {
  description = "Maximum number of images to keep in ECR repository"
  type        = number
  default     = 2
}

variable "docker_platform" {
  description = "Platform for Docker image build"
  type        = string
  default     = "linux/x86_64"
}

variable "log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 3
}

# Backend Configuration
variable "backend_cors_origins" {
  description = "Comma-separated list or JSON array of allowed CORS origins for the backend"
  type        = string
  default     = "[]"
}

variable "ai_model" {
  description = "Generative AI model name"
  type        = string
  default     = "gemini-2.0-flash-lite"
}

variable "popular_dishes_prompt" {
  description = "Prompt for the AI to identify popular dishes"
  type        = string
}

variable "recaptcha_enabled" {
  description = "Whether reCAPTCHA is enabled"
  type        = bool
  default     = true
}

# Secrets
variable "maps_api_key" {
  description = "Google Maps API Key"
  type        = string
  sensitive   = true
}

variable "ai_api_key" {
  description = "Generative AI API Key"
  type        = string
  sensitive   = true
}

variable "recaptcha_secret_key" {
  description = "reCAPTCHA secret key"
  type        = string
  sensitive   = true
}

