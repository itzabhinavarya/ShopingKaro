variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Project prefix for resources"
  type        = string
  default     = "shopingkaro"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod) used for tagging"
  type        = string
  default     = "dev"
}

variable "ecs_desired_count" {
  type    = number
  default = 1
}

variable "vpc_id" {
  description = "ID of an existing VPC to use for resources"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of subnet IDs to use for public resources (ALB)"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of subnet IDs to use for private resources (ECS, DB)"
  type        = list(string)
}

variable "acm_certificate_arn" {
  description = "ARN of an existing ACM certificate for the ALB HTTPS listener (must be in the same region)"
  type        = string
}

variable "route53_hosted_zone_id" {
  description = "The Route53 Hosted Zone ID to create the ALB DNS record"
  type        = string
}

variable "route53_record_name" {
  description = "The DNS record name to create in Route53 for the ALB (e.g., app.example.com)"
  type        = string
}

variable "docdb_username" {
  description = "Username for DocumentDB admin user"
  type        = string
  sensitive   = true
}

variable "docdb_password" {
  description = "Password for DocumentDB admin user"
  type        = string
  sensitive   = true
}

variable "container_image_uri" {
  description = "URI of the container image to deploy in ECS (could be ECR or Docker Hub)"
  type        = string
}

variable "s3_bucket_env_file_arn" {
  description = "ARN of the S3 bucket environment file"
  type        = string
}