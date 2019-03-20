#!/usr/bin/env bash

# --- Fetch companies data ---
git clone --depth 1 https://github.com/datenanfragen/data tmp
mkdir -p content/company
mkdir -p content/supervisory-authority
mkdir -p static/templates
mkdir -p static/db
mkdir -p static/db/suggested-companies
mkdir -p static/db/sva
cp tmp/companies/* static/db
cp tmp/suggested-companies/* static/db/suggested-companies
cp tmp/supervisory-authorities/* static/db/sva
cp tmp/companies/* content/company
cp tmp/supervisory-authorities/* content/supervisory-authority
cp -r tmp/templates/* static/templates
mv tmp/schema.json tmp/schema-supervisory-authorities.json static
rm -rf tmp
node prepare-deploy.js
# Unfortunately, Hugo only accepts .md files as posts, so we have to rename our JSONs, see https://stackoverflow.com/a/27285610
cd content/company || exit
# Hugo doesn't fallback to the default language here, so we have to copy the files for every language
find . -name '*.json' -exec sh -c 'cp "$0" "${0%.json}.en.md" && mv "$0" "${0%.json}.de.md"' {} \;

cd ../supervisory-authority || exit
find . -name '*.json' -exec sh -c 'cp "$0" "${0%.json}.en.md" && mv "$0" "${0%.json}.de.md"' {} \;

cd ../.. || exit

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
