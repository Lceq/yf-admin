const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');
const config = require('../config');

// fs.open('./build/env.js', 'w', function(err, fd) {
// //     const buf = 'export default "development";';
// //     fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
// // });

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: '远纺工业(无锡)有限公司' + package.version,
            favicon: './favicon.png',
            filename: '../index.html',
            inject: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/views/main-components/theme-switch/theme'
            },
            {
                from: 'src/views/my-components/text-editor/tinymce'
            }
        ], {
            ignore: [
                'text-editor.vue'
            ]
        })
    ],
    devServer: {
        proxy: [{
            context: [],
            target: "",
          }]
    }
});
