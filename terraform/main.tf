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
  bucket_name = var.bucket_name
  function_name = module.lambda.function_name
  function_arn = module.lambda.function_arn
}

module "fotos" {
  source = "./s3_fotos"
  fotos_name = var.fotos_name
  function_name = module.lambda.function_name
  function_arn = module.lambda.function_arn
}

module "website" {
  source = "./s3_website"
  website_name = var.website_name
  function_name = module.lambda.function_name
  function_arn = module.lambda.function_arn
}

module "sns" {
  source = "./sns"
  email_subscription = var.email
}

output "sns_arn" {
  value = module.sns.sns_arn
}

module "cloudwatch" {
  source = "./cloudwatch"
  sns_arn = module.sns.sns_arn
}

variable "bucket_name" {
  type = string
  default = "ProjetoBucket130"
}

variable "website_name" {
  type = string
  default = "ProjetoBucket131"
}

variable "fotos_name" {
  type = string
  default = "ProjetoBucket132"
}

variable "email" {
  type = string
  default = "niveaadl@al.insper.edu.br"
}