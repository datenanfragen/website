#!/usr/bin/env bash

./deploy-common.sh

# --- Run Webpack and Hugo ---
yarn run build
hugo --config config-branch.toml,config-dev.toml,config-menus.toml --baseURL $DEPLOY_PRIME_URL
