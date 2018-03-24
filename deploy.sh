# --- Fetch companies data ---
git clone https://github.com/datenanfragen/companies tmp
mkdir -p content/company
mv tmp/data/* content/company
rm -rf tmp
# Unfortunately, Hugo only accepts .md files as posts, so we have to rename our JSONs, see https://stackoverflow.com/a/27285610
cd content/company
find . -name '*.json' -exec sh -c 'mv "$0" "${0%.json}.md"' {} \;

# --- Run Hugo ---
cd ../..
hugo --baseURL=$URL
