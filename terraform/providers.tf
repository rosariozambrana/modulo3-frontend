terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # ── Terraform State en S3 ─────────────────────────────────────
  # Mismo bucket que el backend, pero diferente key (ruta)
  # backend/terraform.tfstate  → estado del backend
  # frontend/terraform.tfstate → estado del frontend
  backend "s3" {
    bucket = "modulo3-terraform-state-019163347491"
    key    = "frontend/terraform.tfstate"
    region = "us-east-1"
  }
}

# Proveedor AWS: trabaja con AWS en us-east-1
provider "aws" {
  region = var.aws_region
}
