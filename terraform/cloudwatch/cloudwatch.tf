variable "sns_arn" {
  type = string
}

resource "aws_cloudwatch_log_metric_filter" "lambda_log_filter" {
  name           = "lambda-log-filter"
  pattern        = "{ $.eventType = Error }" # Substitua pelo padrão que você deseja monitorar
  log_group_name = "/aws/lambda/events"      # Substitua pelo nome do grupo de log correto

  metric_transformation {
    name        = "ErrorCount"
    namespace   = "Custom/CloudWatchLogs"
    value       = "1"
    default_value = "0"
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_log_alarm" {
  alarm_name          = "lambda-log-alarm"
  alarm_description   = "Alarm triggered on CloudWatch Logs"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "ErrorCount"
  namespace           = "Custom/CloudWatchLogs"
  period              = "60"
  statistic           = "SampleCount"
  threshold           = "1"
  alarm_actions       = [var.sns_arn]
  treat_missing_data  = "missing"
}

resource "aws_cloudwatch_log_metric_filter" "lambda_log_filter_subscription" {
  name           = "lambda-log-filter-subscription"
  pattern        = "{ $.eventType = Error }" # Substitua pelo padrão que você deseja monitorar
  log_group_name = "/aws/lambda/events"      # Substitua pelo nome do grupo de log correto

  metric_transformation {
    name      = "ErrorCountSubscription"
    namespace = "Custom/CloudWatchLogs"
    value     = "1"
  }
}
