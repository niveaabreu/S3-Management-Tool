
resource "aws_lambda_function" "example" {
  function_name = "events"
  runtime = "python3.8"
  handler = "events.lambda_handler"
  role = aws_iam_role.lambda.arn

  filename = "lambda/events.zip"

  environment {
    variables = {
      EXAMPLE_VARIABLE = "example_value"
    }
  }
}

resource "aws_iam_role" "lambda" {
  name = "a1s3-events-execution-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda.name
}

output "function_name" {
  value = aws_lambda_function.example.function_name
}

output "function_arn" {
  value = aws_lambda_function.example.arn
}
