#!/bin/bash
git checkout -- .
git pull
rm -rf dist
npm run zkxc
rm -rf /usr/local/nginx/html/zkxc/*
\cp -r dist/* /usr/local/nginx/html/zkxc
