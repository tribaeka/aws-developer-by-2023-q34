#!/bin/bash

yum update -y
yum install -y nodejs
sudo yum install -y postgresql15

aws s3 sync s3://yahor-hlushak-ci/app /opt/node-app

cd /opt/node-app
npm i
node index.js > index.log.txt
