var merge = require('webpack-merge');
var prodEnv = require('./test.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    REQUEST_HOST: '"http://36.155.114.131:8088"',
    MAIN_TITLE: '"智造管理平台"',
    LOGIN_TITLE: '"昇虹纺纱智造管理平台"',
    LOGIN_TITLE_MIN: '"纺纱专版"'
});