#!/bin/bash

yum update -y
yum install -y nodejs

aws s3 sync s3://yahor-hlushak-ci /opt/node-app

cd /opt/node-app
npm i
node index.js
