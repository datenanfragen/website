#!/usr/bin/env bash

./deploy-common.sh

# --- Run Webpack and Hugo ---
yarn run build
hugo -e staging --baseURL $DEPLOY_PRIME_URL --minify
