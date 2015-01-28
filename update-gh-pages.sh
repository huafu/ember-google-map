#!/bin/bash
# this scripts expect that the gh-pages directory is a clone of the `gh-pages` github branch

cd $(dirname $0)
GH_PAGES_DIR=./gh-pages
EMBER_CLI_BASE_URL='/ember-google-map/' ember build --env=production && \
rm -rf ${GH_PAGES_DIR}/* && \
cp -R dist/* ${GH_PAGES_DIR}/ && \
cd ${GH_PAGES_DIR} && \
git add -A && \
git commit -m 'Updating GitHub pages' && \
git push origin gh-pages:gh-pages
