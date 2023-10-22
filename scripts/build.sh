#!/bin/bash

npx tsc

cp package.json build/
cp src/config/rds-ca-2019-root.pem build/config/

node scripts/fixPackageJson.js
