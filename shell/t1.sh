#!/bin/bash
git checkout -- .
git pull
rm -rf dist
npm run t1
rm -rf /usr/local/nginx/html/t1/*
\cp -r dist/* /usr/local/nginx/html/t1
