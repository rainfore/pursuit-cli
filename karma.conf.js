'use strict';

const filePath = process.cwd() + '/.rgui-cache/test/index.js';
const reportsPath = process.cwd() + '/test-reports';

let preprocessors = {};
preprocessors[filePath] = 'webpack';

let webpackConfig = require('./webpack.conf.js')({
    output: {libraryTarget: 'umd'}
});
webpackConfig.module.loaders.push({test: /\.js$/, exclude: /(test|node_modules)\//, loader: require.resolve('isparta-loader')});

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],    // 'Chrome', 'Firefox', 'IE', 'IE9', 'IE8'
        frameworks: ['mocha', 'expect'],
        files: [
            './node_modules/babel-polyfill/dist/polyfill.min.js',
            './node_modules/regularjs/dist/regular.min.js',
            filePath
        ],
        preprocessors: preprocessors,
        webpack: webpackConfig,
        webpackMiddleware: {noInfo: true},
        reporters: ['nyan', 'coverage'],
        coverageReporter: {
            dir: `${reportsPath}/coverage`,
            reporters: [
                {type: 'lcov', subdir: '.'},
                {type: 'text'},
            ]
        },
        // htmlReporter: {
        //     outputDir: `${reportsPath}/result`
        // }
    });
};
