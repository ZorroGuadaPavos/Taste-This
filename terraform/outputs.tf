
output "lambda_function_name" {
  description = "The name of the Lambda Function"
  value       = module.lambda_function.lambda_function_name
}

output "api_endpoint" {
  description = "The HTTP API Gateway endpoint URL"
  value       = module.apigateway.apigatewayv2_api_api_endpoint
}

output "lambda_cloudwatch_log_group_arn" {
  description = "The ARN of the Cloudwatch Log Group"
  value       = module.lambda_function.lambda_cloudwatch_log_group_arn
}
