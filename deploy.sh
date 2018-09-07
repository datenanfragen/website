#!/usr/bin/env bash

./deploy-common.sh

# --- Run Webpack and Hugo ---
yarn run build
hugo --config config.toml,config-menus.toml # TODO: This will (hopefully) produce a merge conflict when !23 is merged. `config-menus.toml` just has to be added to both `deploy-branch.sh` and `deploy.sh`
# The Netlify _redirect config has to be in /public
cp _redirects public/_redirects
