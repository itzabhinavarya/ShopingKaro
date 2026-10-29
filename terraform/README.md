# ShoppingKaro Infrastructure as Code (Terraform)

This repository contains Terraform configurations for deploying the ShoppingKaro application infrastructure on AWS. The setup includes containerized ECS Fargate services, DocumentDB for data persistence, S3 for configuration storage, Application Load Balancer for traffic distribution, and comprehensive security hardening.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.0
- AWS CLI configured with appropriate credentials
- An existing VPC with public and private subnets
- An ACM certificate ARN for HTTPS (ALB listener)
- Route 53 hosted zone for DNS management
- An Amazon ECR repository for container images
- An S3 bucket for storing the environment file

## Variable Configuration

Create a `terraform.tfvars` file in the root directory of this Terraform configuration and populate it with the following variables. Replace the placeholder values with your actual AWS resources and configuration:

```hcl
aws_region               = "eu-west-3"
project_name             = "shopingkaro"
environment              = "dev"  # or "prod"
vpc_id                   = "vpc-xxxxxxxxx"
public_subnet_ids        = ["subnet-xxxxx", "subnet-xxxxx"]
private_subnet_ids       = ["subnet-xxxxx", "subnet-xxxxx"]
acm_certificate_arn      = "arn:aws:acm:eu-west-3:xxxx:certificate/xxxxx"
route53_hosted_zone_id   = "Z1234567890ABC"
route53_record_name      = "app.example.com"
docdb_username           = "admin"
docdb_password           = "SecurePassword123!"
container_image_uri      = "123456789012.dkr.ecr.eu-west-3.amazonaws.com/shopingkaro"
s3_bucket_env_file_arn = "arn:aws:s3:::shopingkaro/nev_file.env"
```

## Usage

### 1. Initialize Terraform (with Remote Backend)

```bash
# For local state (development):
terraform init

# For remote state (recommended for team/production):
terraform init \
  -backend-config="bucket=your-terraform-state-bucket" \
  -backend-config="key=shopingkaro/terraform.tfstate" \
  -backend-config="region=eu-west-3" \
```

### 2. Validate Configuration

```bash
terraform validate
terraform fmt -check .  # Check formatting
```

### 3. Plan Changes

```bash
terraform plan -out=tfplan
```

### 4. Apply Configuration

```bash
terraform apply tfplan
```

### 5. View Outputs

```bash
terraform output
terraform output alb_dns
terraform output docdb_endpoint
```

### 6. Destroy Infrastructure (Caution!)

```bash
terraform destroy
```


## S3 Environment Configuration
### Prepare the Environment File

Create an `.env` file locally with your DocumentDB connection string and other application configuration:

```bash
# .env file content
MONGODB_URI="mongodb://<username>:<password>@<documentdb_endpoint>:27017/?tls=true&tlsCAFile=/app/global-bundle.pem&retryWrites=false"
```

> **⚠️ Important:** The certificate path `/app/global-bundle.pem` is the default location. If your Docker image stores the certificate at a different path, update the `tlsCAFile` parameter accordingly.

### Upload to S3

Upload the `.env` file to your S3 bucket:

```bash
aws s3 cp .env s3://shopingkaro/env_file.env
```

