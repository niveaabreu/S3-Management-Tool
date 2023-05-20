variable "function_name" {
  type = string
}

variable "function_arn" {
  type = string
}


resource "aws_s3_bucket" "exemplo" {
  bucket = "bucket-projeto-145"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}


resource "aws_lambda_permission" "exemplo" {
  statement_id  = "example-statement-id"
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
