'use strict';

let babelConfig = require('./babelrc.js');

module.exports = function(options) {
    return Object.assign({
        output: {
            filename: 'index.js',
            library: 'RGUI',
            libraryTarget: 'umd'
        },
        externals: {
            'regularjs': {
                root: 'Regular',
                amd: 'Regular',
                commonjs: 'regularjs',
                commonjs2: 'regularjs'
            }
        },
        babel: babelConfig,
        module: {
            loaders: [
                { test: /\.rgl$/, loader: require.resolve('rgl-loader') },
                { test: /\.js$/, exclude: /node_modules\/(?!rgui-)/, loader: require.resolve('babel-loader') }
            ]
        }
    }, options || {});
}
