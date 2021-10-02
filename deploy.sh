#!/usr/bin/env bash
set -e

if [ "$NETLIFY" = "true" ] && [ "$BRANCH" = "master" ];
then
    rm -rf public
    mkdir public
    echo 'No Netlify deploy previews on master.' > public/index.html
    echo 'Skipping deploy preview for master on Netlify.'
    exit
fi

languages=(de en fr pt es hr)

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
else
    hugo -e staging --baseURL "$DEPLOY_PRIME_URL" --minify
    cp _headers public/_headers
fi

find "public" -regex '.*/styles/.*\.css' -exec sh -c  'echo $0 | sed "s/\(.*\.min\)\.[^\.]*\(\.[^\.]*\)$/\1\2/" | xargs mv $0 ' {}  \;
