resource "aws_s3_bucket" "website" {
  bucket = "projetocloudnivea21"
}

resource "aws_s3_bucket_ownership_controls" "example" {
  bucket = aws_s3_bucket.website.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "example" {
  depends_on = [
    aws_s3_bucket_ownership_controls.example,
    aws_s3_bucket_public_access_block.example,
  ]

  bucket = aws_s3_bucket.website.id
  acl    = "public-read"
}


resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  versioning_configuration {
    status = "Enabled"
  }
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_policy" "public_read_access" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.public_read_access.json
}

data "aws_iam_policy_document" "public_read_access" {
  depends_on = [
    aws_s3_object.index_page,
  ]

  statement {
    principals {
	  type = "*"
	  identifiers = ["*"]
	}

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.website.arn,
      "${aws_s3_bucket.website.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.bucket

  index_document {
    suffix = "index.html"
  }

}

resource "aws_s3_object" "index_page" {
  bucket       = aws_s3_bucket.website.id
  key          = "index.html"
  content_type = "text/html; charset=UTF-8"
  source       = "s3_website/index.html"
}