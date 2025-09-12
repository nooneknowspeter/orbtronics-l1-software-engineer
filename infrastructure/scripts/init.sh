#!/usr/bin/env bash

sudo apt update && sudo apt upgrade -y

sudo apt install -y neofetch direnv nix-bin make

sudo snap install docker

git clone https://github.com/nooneknowspeter/orbtronics-l1-software-engineer.git app

cd app

sudo make
