#!/usr/bin/env bash
set -e

process_number=4

# We don't need Netlify builds on master. This seems to be the easiest way to achieve this.
# See https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables for the env vars set by Netlify.
if [ "$NETLIFY" = "true" ] && [ "$BRANCH" = "master" ];
then
    rm -rf public
    mkdir public
    echo 'No Netlify deploy previews on master.' > public/index.html
    echo 'Skipping deploy preview for master on Netlify.'
    exit
fi

mkdir -p i18n
languages=(de en fr pt es hr nl cs)

echo "Fetching data…"
# If the previous deploy script failed, we need to remove the data_tmp folder first,
rm -rf data_tmp
git clone --depth 1 https://github.com/datenanfragen/data data_tmp

# When developing locally, we need to make sure to remove any old company pages.
rm -rf content/**/company
rm -rf content/**/supervisory-authority
rm -rf static/db

echo "Creating directories…"
company_content_dir="$(printf "content/%s/company\n" "${languages[@]}")"
sva_content_dir=$(printf "content/%s/supervisory-authority\n" "${languages[@]}")

echo -e "$company_content_dir\n$sva_content_dir" | xargs -n 1 -P $process_number mkdir -p

mkdir -p static/templates
mkdir -p static/db
mkdir -p static/db/company-packs
mkdir -p static/db/sva

echo "Copying files…"
cp data_tmp/companies/* static/db
cp data_tmp/obsolete-records/* static/db
cp data_tmp/supervisory-authorities/* static/db/sva

# Unfortunately, Hugo only accepts .md files as posts, so we have to rename our JSONs, see https://stackoverflow.com/a/27285610
# To speed this up, we rename all files once in `data_tmp` and only then copy them to the language directories.
find "data_tmp" -regex '.*/\(companies\|supervisory-authorities\)/.*\.json$' -print | sed -e "p" -e "s/.json$/.md/g" | xargs -P $process_number -n 2  mv

# We need to use the shell here because otherwise bash would expand the `*`, which crashes in Circle CI
echo $company_content_dir | xargs -P $process_number -n 1 sh -c 'cp data_tmp/companies/* $0'
echo $sva_content_dir | xargs -P $process_number -n 1 sh -c 'cp data_tmp/supervisory-authorities/* $0'

cp -r data_tmp/templates/* static/templates

mv data_tmp/schema.json data_tmp/schema-supervisory-authorities.json static

yarn tsm scripts/handle-obsolete-records.ts
yarn tsm scripts/compile-company-packs.ts
yarn tsm scripts/compile-data-dump.ts

rm -rf data_tmp

cd content || exit
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
    cp _redirects public/_redirects
fi

# Finds all generated css files, matches and removes the second last non-dot characters (the md5 hash) and renames the files to the new filename without hash
# This is really not a good fix and I beg hugo to change this!
find "public" -regex '.*/styles/.*\.css' -print | sed -e "p" -e "s/\(.*\.min\)\.[^\.]*\(\.[^\.]*\)$/\1\2/" | xargs -P $process_number -n 2 mv
