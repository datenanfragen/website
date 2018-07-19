#!/usr/bin/env bash
# --- Fetch companies data ---
git clone --depth 1 https://github.com/datenanfragen/data tmp
mkdir -p content/company
mkdir -p static/templates
mkdir -p static/db
cp tmp/companies/* static/db
mv tmp/companies/* content/company
mv tmp/templates/* static/templates
rm -rf tmp
# Unfortunately, Hugo only accepts .md files as posts, so we have to rename our JSONs, see https://stackoverflow.com/a/27285610
cd content/company
# TODO: I don't know why but for some reason Hugo doesn't fallback to the default language here, so we have to copy the files for every language, which is *very* ugly.
find . -name '*.json' -exec sh -c 'cp "$0" "${0%.json}.en.md"' {} \;
find . -name '*.json' -exec sh -c 'mv "$0" "${0%.json}.de.md"' {} \;

# --- Run Webpack and Hugo ---
cd ../..
yarn run build
hugo
# The Netlify _redirect config has to be in /public
cp _redirects public/_redirects
