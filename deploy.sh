#!/usr/bin/env bash
set -e

languages=(de en fr pt)

echo "Fetching data…"
git clone --depth 1 https://github.com/datenanfragen/data data_tmp

echo "Creating directories…"
for lang in ${languages[@]}
do
    mkdir -p "content/$lang/company"
    mkdir -p "content/$lang/supervisory-authority"
done

mkdir -p static/templates
mkdir -p static/db
mkdir -p static/db/suggested-companies
mkdir -p static/db/sva

echo "Copying files…"
cp data_tmp/companies/* static/db
cp data_tmp/suggested-companies/* static/db/suggested-companies
cp data_tmp/supervisory-authorities/* static/db/sva

for lang in ${languages[@]}
do
    cp data_tmp/companies/* "content/$lang/company"
    cp data_tmp/supervisory-authorities/* "content/$lang/supervisory-authority"
done

cp -r data_tmp/templates/* static/templates

mv data_tmp/schema.json data_tmp/schema-supervisory-authorities.json static

rm -rf data_tmp

node prepare-deploy.js

cd content || exit

# Unfortunately, Hugo only accepts .md files as posts, so we have to rename our JSONs, see https://stackoverflow.com/a/27285610
echo "Renaming JSON files…"

for lang in ${languages[@]}
do
    find "$lang/company" -name '*.json' -exec sh -c 'mv "$0" "${0%.json}.md"' {} \;
    find "$lang/supervisory-authority" -name '*.json' -exec sh -c 'mv "$0" "${0%.json}.md"' {} \;
done

cd .. || exit

yarn licenses generate-disclaimer --ignore-optional --ignore-platform > static/NOTICES.txt

echo "Running Webpack and Hugo…"
yarn run build

if [ "$CONTEXT" = "production" ]
then
    hugo -e production --minify
    if [ -n "$DATTEL_SERVER" ] && [ -n "$DATTEL_TOKEN" ]
    then
        yarn deploy-dattel
    fi
    # TODO: This will soon not be necessary anymore.
    echo "Copying files for Netlify…"
    cp _redirects public/_redirects
    cp _headers public/_headers
    cp static/404.html public/404.html
else
    hugo -e staging --baseURL "$DEPLOY_PRIME_URL" --minify
    cp _headers public/_headers
fi
