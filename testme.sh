#!/bin/sh
yarn clean
./bin/fakeversion.sh
yarn install
yarn setup
yarn lint
./bin/test/test_dependency.sh
./bin/test/test_coverage.sh
./bin/test/test_integration.sh
