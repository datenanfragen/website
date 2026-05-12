#!/bin/bash

rm -rf node_modules
yarn install --check-files --no-progress --no-colors 2> temp_yarn_output.txt 1>/dev/null
touch yarn_issues_assessed.txt
grep -E "^(error|warning)" temp_yarn_output.txt > yarn_issues.txt

# skip all assessed errors and warnings
grep -vxFf yarn_issues_assessed.txt yarn_issues.txt > new_issues.txt

if [ -s new_issues.txt ]
then
    echo "New not yet assessed yarn issues found:"
    cat new_issues.txt
    rm temp_yarn_output.txt yarn_issues.txt new_issues.txt
    exit 1
fi

rm temp_yarn_output.txt yarn_issues.txt new_issues.txt


