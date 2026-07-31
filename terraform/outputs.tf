# ── Outputs: información que Terraform muestra al terminar ──────

output "frontend_url" {
  description = "URL pública del frontend (Elastic Beanstalk)"
  value       = "http://${aws_elastic_beanstalk_environment.frontend.cname}"
}

output "eb_environment_name" {
  description = "Nombre del ambiente Elastic Beanstalk (usado por el CD pipeline)"
  value       = aws_elastic_beanstalk_environment.frontend.name
}

output "vpc_id" {
  description = "ID de la VPC del frontend"
  value       = aws_vpc.main.id
}
