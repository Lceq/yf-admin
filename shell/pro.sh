#!/bin/bash
git checkout -- .
git pull
rm -rf dist
npm run pro
rm -rf /usr/local/nginx/mes/*
\cp -r dist/* /usr/local/nginx/mes/
