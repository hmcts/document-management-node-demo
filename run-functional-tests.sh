#!/bin/bash

ADDITIONAL_COMPOSE_FILE=docker-compose.functional-tests.yml

docker-compose -f ${ADDITIONAL_COMPOSE_FILE} build node-demo-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d remote-webdriver
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run node-demo-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down

