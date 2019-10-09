#!/bin/bash
git checkout -- .
git pull
rm -rf dist
npm run zkfz
rm -rf /usr/local/nginx/html/zkfz/*
\cp -r dist/* /usr/local/nginx/html/zkfz
