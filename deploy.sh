#!/usr/bin/env bash

./deploy-common.sh

# --- Run Webpack and Hugo ---
yarn run build
hugo -e production --minify
# The Netlify _redirect config has to be in /public
cp _redirects public/_redirects
