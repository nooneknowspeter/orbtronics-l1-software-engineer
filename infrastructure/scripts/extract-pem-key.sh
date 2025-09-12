#!/usr/bin/env bash

if command -v terraform; then
  echo "command terraform not found"
fi

echo "extracting private key"

if command -v cat private-key.pem; then
  chmod 600 private-key.pem
  touch private-key.pem
fi

terraform output -raw aws_key_pair_private_key > private-key.pem
