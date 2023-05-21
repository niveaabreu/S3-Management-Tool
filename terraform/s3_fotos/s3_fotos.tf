variable "function_name" {
  type = string
}

variable "function_arn" {
  type = string
}


resource "aws_s3_bucket" "exemplo_fotos" {
  bucket = "fotos-projeto-145"

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


resource "aws_lambda_permission" "exemplo_fotos" {
  statement_id  = "fotos-statement-id"
  action        = "lambda:InvokeFunction"
  function_name =  var.function_name
 principal     = "s3.amazonaws.com"
  source_arn    = "${aws_s3_bucket.exemplo_fotos.arn}/"
}

module "s3_notification" {
  source  = "terraform-aws-modules/s3-bucket/aws//modules/notification"
  version = "~> 3.0"

  bucket = aws_s3_bucket.exemplo_fotos.id
  eventbridge = true

  lambda_notifications = {
    lambda = {
      function_arn  = var.function_arn
      function_name = var.function_name
      events        = ["s3:ObjectCreated:*"]
    }
  }
}
