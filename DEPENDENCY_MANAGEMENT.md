# Dependency Management
This document describes the current status of our dependency management and dependency assessment.

# Never ignore errors and warnings
If `ỳarn` issues a `warning` or `error`then act on it and do an assessment.
Our CI/CD pipeline will check if there are warnings or errors that are new and not yet assessed.

# Assessment of warnings and errors
If you spot yarn errors and warnings then fix it. If you think it is safe to ignore them, then add the warning or error
message to our [ignore list](./yarn_issues_assessed.txt) and put a comment line above it to inform other developers
why it is safe to ignore this message. 
