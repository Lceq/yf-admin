#!/bin/bash
git checkout -- .
git pull
rm -rf dist
npm run t2
rm -rf /usr/local/nginx/html/t2/*
\cp -r dist/* /usr/local/nginx/html/t2
