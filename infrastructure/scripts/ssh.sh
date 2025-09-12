#!/usr/bin/env bash

AWS_INSTANCE_PUBLIC_IP=$(terraform output -raw aws_instance_public_ip)

ssh -i private-key.pem ubuntu@${AWS_INSTANCE_PUBLIC_IP}
