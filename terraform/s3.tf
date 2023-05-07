#Provider and default region used
provider "aws" {
  region     = "us-east-2"
}

resource "aws_s3_bucket" "exemplo" {
  bucket = "bucket-nivea-45686"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}