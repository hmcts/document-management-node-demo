#!/bin/sh
#sudo apt-get install -y docker docker-compose
clear;
docker-compose pull
docker-compose -f docker-compose.yml -f docker-compose-dev.yml up --build
