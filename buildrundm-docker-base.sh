#!/bin/sh
#sudo apt-get install -y docker docker-compose
clear;
docker-compose pull -f docker-compose-base.yml
docker-compose -f docker-compose-base.yml -f docker-compose-dev-base.yml up --build
