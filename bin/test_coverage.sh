#!/bin/sh
yarn test
yarn test:coverage
xdg-open mochawesome-report/mochawesome.html
open mochawesome-report/mochawesome.html

xdg-open coverage/lcov-report/index.html
open coverage/lcov-report/index.html
