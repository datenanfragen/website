#!/usr/bin/env bash
set -e

# --- Fetch companies data ---
git clone --depth 1 https://github.com/datenanfragen/data data_tmp
mkdir -p content/company
mkdir -p content/supervisory-authority
mkdir -p static/templates
mkdir -p static/db
mkdir -p static/db/suggested-companies
mkdir -p static/db/sva
cp data_tmp/companies/* static/db
cp data_tmp/suggested-companies/* static/db/suggested-companies
cp data_tmp/supervisory-authorities/* static/db/sva
cp data_tmp/companies/* content/company
cp data_tmp/supervisory-authorities/* content/supervisory-authority
cp -r data_tmp/templates/* static/templates
mv data_tmp/schema.json data_tmp/schema-supervisory-authorities.json static
rm -rf data_tmp
node prepare-deploy.js
# Unfortunately, Hugo only accepts .md files as posts, so we have to rename our JSONs, see https://stackoverflow.com/a/27285610
cd content/company || exit
# Hugo doesn't fallback to the default language here, so we have to copy the files for every language
find . -name '*.json' -exec sh -c 'for lang in de fr pt ; do cp "$0" "${0%.json}.$lang.md" ; done && mv "$0" "${0%.json}.en.md"' {} \;

cd ../supervisory-authority || exit
find . -name '*.json' -exec sh -c 'for lang in de fr pt ; do cp "$0" "${0%.json}.$lang.md" ; done && mv "$0" "${0%.json}.en.md"' {} \;

cd ../.. || exit

yarn licenses generate-disclaimer --ignore-optional --ignore-platform > static/NOTICES.txt

# --- Run Webpack and Hugo ---
yarn run build

if [ "$CONTEXT" = "production" ]
then
	hugo -e production --minify
	# Copy files for Netlify
	cp _redirects public/_redirects
	cp static/404.html public/404.html
else
	hugo -e staging --baseURL "$DEPLOY_PRIME_URL" --minify
fi
