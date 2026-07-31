# ── Elastic Beanstalk Application ─────────────────────────────
resource "aws_elastic_beanstalk_application" "frontend" {
  name        = "${var.app_name}-frontend"
  description = "Aplicación frontend React/Vite servida con Docker"

  tags = {
    Name        = "${var.app_name}-frontend"
    Environment = var.environment
  }
}

# ── Elastic Beanstalk Environment ─────────────────────────────
resource "aws_elastic_beanstalk_environment" "frontend" {
  name                = "${var.app_name}-frontend-${var.environment}"
  application         = aws_elastic_beanstalk_application.frontend.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.4.1 running Docker"

  # ── Configuración de red ──
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.main.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = "${aws_subnet.public_a.id},${aws_subnet.public_b.id}"
  }

  # ── Configuración de instancias ──
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = var.eb_instance_type
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.eb_instance_profile.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb.id
  }

  # ── Rol de servicio ──
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.eb_service_role.arn
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  # ── Variables de entorno del frontend ──
  # VITE_API_URL le dice al frontend dónde está el backend
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NODE_ENV"
    value     = "production"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PORT"
    value     = "8080"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "VITE_API_URL"
    value     = "${var.backend_url}/api"  # URL del backend que Terraform del backend generó
  }

  # ── Health check ──
  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "basic"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application"
    name      = "Application Healthcheck URL"
    value     = "/"
  }

  tags = {
    Name        = "${var.app_name}-frontend-${var.environment}"
    Environment = var.environment
  }

  depends_on = [
    aws_iam_instance_profile.eb_instance_profile
  ]
}
