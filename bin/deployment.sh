#!/bin/bash

yarn install --production

NODE_ENV=$1
PORT=$2
ORIGIN_URL=$3

DB_NAME=$4
DB_PASS=$5
DB_USER=$6
DB_URI=$7

SECRET_ACCESS_KEY=$8
SECRET_REFRESH_KEY=$9

VK_CLIENT_ID=${10}
VK_CLIENT_SECRET=${11}

REDIS_URL=${12}
SSL=${13}

SENTRY_DSN=${14}

PROJECT_NAME='MyChoice'

echo "module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    port: '$PORT',
    script: '$PWD/dist/main.js',
    env: {
      NODE_ENV: '$NODE_ENV',
      PORT: '$PORT',
      ORIGIN_URL: '$ORIGIN_URL',
      DB_NAME: '$DB_NAME',
      DB_URI: '$DB_URI',
      DB_USER: '$DB_USER',
      DB_PASS: '$DB_PASS',
      SECRET_ACCESS_KEY: '$SECRET_ACCESS_KEY',
      SECRET_REFRESH_KEY: '$SECRET_REFRESH_KEY',
      VK_CLIENT_ID: '$VK_CLIENT_ID',
      VK_CLIENT_SECRET: '$VK_CLIENT_SECRET',
      REDIS_URL: '$REDIS_URL',
      SSL: '$SSL',
      SENTRY_DSN: '$SENTRY_DSN',
    },
  }],
};" >| ecosystem.config.js

pm2 delete $PROJECT_NAME
pm2 start
rm ecosystem.config.js