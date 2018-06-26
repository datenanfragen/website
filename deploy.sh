#!/usr/bin/env bash

./deploy-common.sh

# --- Run Webpack and Hugo ---
yarn run build
hugo
# The Netlify _redirect config has to be in /public
cp _redirects public/_redirects
