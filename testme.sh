#!/bin/sh
#sudo apt-get install -y docker docker-compose
clear;
yarn install
yarn setup-dev
yarn lint
./bin/test/test_dependency.sh
./bin/test/test_unit.sh
./bin/test/test_coverage.sh
./bin/test/test_integration.sh





#yarn lint
#yarn e2e
#yarn test
#yarn test-all
#yarn test:a11y
#yarn test:coverage
#yarn test:nsp
#yarn test:nsp-warn
#yarn test:snyk
#yarn test:smoke
#yarn test:functional
#yarn health-check
#yarn sonar-scan
#yarn test:codacy-upload
#yarn test:codecov-upload
