terraform {
  required_version = "~> 1.13.1"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "4.0.6"
    }
  }

  backend "s3" {
    bucket = "orbtronics"
    region = "us-east-1"
    key    = "app-state"
  }
}

provider "tls" {}

provider "aws" {}
