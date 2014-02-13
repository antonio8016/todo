#!/bin/sh

# Start the db
# mongod -dbpath ~/data/db

# Run mocha using istanbul
istanbul cover _mocha -- -R spec

# Open the coverage report
open coverage/lcov-report/index.html
