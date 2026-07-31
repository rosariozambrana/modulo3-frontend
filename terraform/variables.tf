variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Nombre base de la aplicación"
  type        = string
  default     = "modulo3"
}

variable "environment" {
  description = "Entorno de despliegue: development, staging o production"
  type        = string
  default     = "production"
}

# ── Elastic Beanstalk ──────────────────────────────────────────
variable "eb_instance_type" {
  description = "Tipo de instancia EC2 para Elastic Beanstalk (t3.micro está en capa gratuita)"
  type        = string
  default     = "t3.micro"
}

variable "frontend_image" {
  description = "Imagen Docker del frontend (ej: ghcr.io/usuario/modulo3-frontend:latest)"
  type        = string
}

# ── Conexión al Backend ────────────────────────────────────────
# El frontend necesita saber la URL del backend para hacer peticiones a la API
# Si aún no está disponible, se deja vacío y se actualiza luego
variable "backend_url" {
  description = "URL pública del backend (Elastic Beanstalk del backend)"
  type        = string
  default     = ""  # Valor por defecto vacío — no falla si el secret no existe
}
