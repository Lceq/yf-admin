#!/bin/bash
git checkout -- .
git pull
rm -rf dist
npm run demo
rm -rf /usr/local/nginx/html/demo/*
\cp -r dist/* /usr/local/nginx/html/demo
