#!/bin/bash

ADDITIONAL_COMPOSE_FILE=docker-compose.functional-tests.yml

docker-compose -f ${ADDITIONAL_COMPOSE_FILE} up --no-color -d -e GRADLE_OPTS remote-webdriver
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} run -e GRADLE_OPTS node-demo-tests
docker-compose -f ${ADDITIONAL_COMPOSE_FILE} down

