#!/usr/bin/env bash
# --- Fetch companies data ---
git clone --depth 1 https://github.com/datenanfragen/companies tmp
mkdir -p content/company
mv tmp/data/* content/company
rm -rf tmp
# Unfortunately, Hugo only accepts .md files as posts, so we have to rename our JSONs, see https://stackoverflow.com/a/27285610
cd content/company
find . -name '*.json' -exec sh -c 'mv "$0" "${0%.json}.md"' {} \;

# --- Run Webpack and Hugo ---
cd ../..
yarn run build
hugo --baseURL=$URL
