#!/usr/bin/env bash

setupDevServer () {
  DIR=$1
  SRC='.meteor/local/build/programs/web.browser'
  rm -r ${DIR}
  mkdir -p ${DIR}
  cp -r .dev-server-skeleton/* $DIR
  cp -r "${SRC}/packages" $DIR
  cp -r ${SRC}/app/* $DIR
  chmod -R +w $DIR
}

# Start webpack-dev-server on port 3000
setupDevServer .dev-server
node_modules/.bin/webpack-dev-server -d --progress --devtool none &
WEBPACK_PID=$!

function cleanup {
  kill -9 -- $WEBPACK_PID
}
trap cleanup EXIT

export ROOT_URL="${ROOT_URL:-http://localhost:3000}"
echo Launching Meteor
meteor --port 4000 --raw-logs
