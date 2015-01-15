#!/bin/bash
# this scripts expect that the gh-pages directory is a clone of the `gh-pages` github branch

GH_PAGES_DIR=./gh-pages
ember build --env=production && \
rm -rf ${GH_PAGES_DIR}/* && \
cp -R dist/* ${GH_PAGES_DIR}/
