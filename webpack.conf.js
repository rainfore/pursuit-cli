'use strict';

const babelConfig = require('./babelrc.js');

module.exports = function(options) {
    return Object.assign({
        output: { filename: '[name].js' },
        babel: babelConfig,
        module: {
            loaders: [
                { test: /\.rgl$/, loader: require.resolve('rgl-loader') },
                { test: /\.js$/, exclude: /node_modules\/(?!rgui-)/, loader: require.resolve('babel-loader') }
            ]
        },
    }, options);
}
