resource "aws_sns_topic" "example_topic" {
  name = "example-topic"
}

variable "email_subscription" {
  type    = string
  default = "niveaadl@al.insper.edu.br" # Insira o endereço de e-mail para sobregravação aqui
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.example_topic.arn
  protocol  = "email"
  endpoint  = var.email_subscription
}

output "sns_arn" {
  value = aws_sns_topic.example_topic.arn
}