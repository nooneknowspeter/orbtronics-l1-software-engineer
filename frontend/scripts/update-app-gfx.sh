#!/usr/bin/env bash

if command -v ffmepg; then
  echo "command ffmpeg not found"
fi

if command -v unp; then
  echo "command unp not found"
fi

unp -Uv ./design/orbtronics-l1-software-engineer-frontend-design.zip

mv -f ./orbtronics-l1-software-engineer-frontend-design/* ./public/ && \
  rm -rf ./orbtronics-l1-software-engineer-frontend-design/ ./design/orbtronics-l1-software-engineer-frontend-design.zip

ffmpeg -y -i ./public/favicon-32px.png ./src/app/favicon.ico