#!/bin/sh
clear;
./bin/fakeversion.sh
yarn install
yarn setup
yarn start
