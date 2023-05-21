provider "aws" {
  region     = "us-east-1"
}

module "lambda" {
  source = "./lambda"
}

output "function_name" {
  value = module.lambda.function_name
}

output "function_arn" {
  value = module.lambda.function_arn
}

module "s3" {
  source = "./s3"
  function_name = module.lambda.function_name
  function_arn = module.lambda.function_arn
}

module "fotos" {
  source = "./s3_fotos"
  function_name = module.lambda.function_name
  function_arn = module.lambda.function_arn
}

module "website" {
  source = "./s3_website"
}

module "sns" {
  source = "./sns"
}

output "sns_arn" {
  value = module.sns.sns_arn
}

module "cloudwatch" {
  source = "./cloudwatch"
  sns_arn = module.sns.sns_arn
}