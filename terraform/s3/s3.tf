variable "function_name" {
  type = string
}

variable "function_arn" {
  type = string
}

variable "bucket_name" {
  type = string
  default = "ProjetoBucket130"
}

resource "aws_s3_bucket" "exemplo" {
  bucket = var.bucket_name

  cors_rule {
  allowed_origins = ["*"]
  allowed_methods = ["GET", "PUT", "POST", "DELETE"]
  allowed_headers = ["*"]
  }

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}

resource "aws_lambda_permission" "exemplo" {
  statement_id  = "documentos-statement-id"
  action        = "lambda:InvokeFunction"
  function_name =  var.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "${aws_s3_bucket.exemplo.arn}/"
}

module "s3_notification" {
  source  = "terraform-aws-modules/s3-bucket/aws//modules/notification"
  version = "~> 3.0"
  bucket = aws_s3_bucket.exemplo.id
  eventbridge = true

  lambda_notifications = {
    lambda = {
      function_arn  = var.function_arn
      function_name = var.function_name
      events        = ["s3:ObjectCreated:*"]
    }
  }
}
