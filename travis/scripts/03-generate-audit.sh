#!/bin/bash
set -ev
#-------------------------------------------------------------------------------
# Generate the default audit behaviour
#-------------------------------------------------------------------------------
cd "$HOME"/app
yo jhipster-angular-datatables default --force --no-insight
