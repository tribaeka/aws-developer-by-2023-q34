#!/bin/bash

npx tsc

cp package.json build/

node scripts/fixPackageJson.js
