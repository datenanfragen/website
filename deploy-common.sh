#!/usr/bin/env bash

# --- Fetch companies data ---
git clone --depth 1 https://github.com/datenanfragen/companies tmp
mkdir -p content/company
mkdir -p static/templates
mkdir -p static/db
mkdir -p static/db/suggested-companies
cp tmp/data/* static/db
cp tmp/suggested-companies/* static/db/suggested-companies
cp tmp/data/* content/company
cp -r tmp/templates/* static/templates
mv tmp/schema.json tmp/schema-supervisory-authorities.json static
rm -rf tmp
# Unfortunately, Hugo only accepts .md files as posts, so we have to rename our JSONs, see https://stackoverflow.com/a/27285610
cd content/company
# Hugo doesn't fallback to the default language here, so we have to copy the files for every language
find . -name '*.json' -exec sh -c 'cp "$0" "${0%.json}.en.md"' {} \;
find . -name '*.json' -exec sh -c 'mv "$0" "${0%.json}.de.md"' {} \;
