#!/bin/sh
# Inspired by: https://stackoverflow.com/a/42584779

regex="^[><=]{7}( |$)"

if command -v rg > /dev/null; then
    rg "$regex" --no-binary --ignore --line-number --hidden && exit 1
else
    grep -E "$regex" -H -I --line-number -r --exclude-dir=node_modules && exit 1
fi
exit 0
