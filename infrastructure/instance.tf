variable "aws_instance_ami" {
  type        = string
  nullable    = false
  description = "ec2 instance ami"
  default     = "ami-0360c520857e3138f" # https://cloud-images.ubuntu.com/locator/ec2/
}

variable "aws_key_pair_name" {
  type     = string
  nullable = false
  default  = "terraform-key"
}

variable "aws_key_pair_algorithm" {
  type     = string
  nullable = false
  default  = "ED25519"
}

resource "aws_eip" "this" {
  depends_on = [aws_instance.this]
}

resource "aws_eip_association" "this" {
  allocation_id = aws_eip.this.id
  instance_id   = aws_instance.this.id
}

resource "aws_instance" "this" {
  ami                         = var.aws_instance_ami
  instance_type               = "t2.micro"
  associate_public_ip_address = false
  subnet_id                   = aws_subnet.this.id
  security_groups             = [aws_security_group.this.id]
  key_name                    = aws_key_pair.this.key_name
  user_data_replace_on_change = true
  user_data                   = <<-EOF
    #!/usr/bin/env bash

    sudo apt update && sudo apt upgrade -y

    sudo apt install -y neofetch direnv nix-bin make

    sudo snap install docker

    git clone https://github.com/nooneknowspeter/orbtronics-l1-software-engineer.git /home/ubuntu/app
    cd /home/ubuntu/app

    cat > .env << EOM
    ACCESS_TOKEN_EXPIRES_MINUTES=${var.access_token_expires_minutes}
    JWT_ALGORITHM=${var.jwt_algorithm}
    JWT_SECRET=${var.jwt_secret}
    ME_CONFIG_BASICAUTH_PASSWORD=${var.me_config_basicauth_password}
    ME_CONFIG_BASICAUTH_USERNAME=${var.me_config_basicauth_username}
    MONGO_DATABASE_NAME=${var.mongo_database_name}
    MONGO_INITDB_ROOT_PASSWORD=${var.mongo_initdb_root_password}
    MONGO_INITDB_ROOT_USERNAME=${var.mongo_initdb_root_username}
    EOM

    sudo make
  EOF
}

resource "tls_private_key" "this" {
  algorithm = var.aws_key_pair_algorithm
}

resource "aws_key_pair" "this" {
  key_name   = var.aws_key_pair_name
  public_key = tls_private_key.this.public_key_openssh
}

output "aws_elastic_ip" {
  value = aws_eip.this.public_ip
}

output "aws_elastic_ip_dns" {
  value = aws_eip.this.public_dns
}

output "aws_instance_name" {
  value = aws_instance.this.id
}

output "aws_instance_public_ip" {
  value = aws_instance.this.public_ip
}

output "aws_instance_public_dns" {
  value = aws_instance.this.public_dns
}

output "aws_instance_type" {
  value = aws_instance.this.instance_type
}

output "aws_key_pair_id" {
  value = aws_key_pair.this.id
}

output "aws_key_pair_name" {
  value = aws_key_pair.this.key_name
}

output "aws_key_pair_public_key" {
  value = aws_key_pair.this.public_key
}

output "aws_key_pair_private_key" {
  value     = tls_private_key.this.private_key_pem
  sensitive = true
}
