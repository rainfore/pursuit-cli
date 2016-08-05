'use strict';

const path = require('path');

const babelConfig = require('./babelrc.js');

module.exports = function(options) {
    return Object.assign({
        output: {
            filename: '[name].js',
            library: 'RGUI',
        },
        resolve: {
            alias: { src: path.join(process.cwd(), settings.src) },
        },
        babel: babelConfig,
        module: {
            loaders: [
                { test: /\.rgl$/, loader: require.resolve('rgl-loader') },
                { test: /\.js$/, exclude: /node_modules\/(?!rgui-)/, loader: require.resolve('babel-loader') }
            ],
        },
    }, settings.webpack, options);
}
