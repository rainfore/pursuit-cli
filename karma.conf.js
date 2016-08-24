'use strict';

const filePath = process.cwd() + '/.pursuit-cache/test.js';
const reportsPath = process.cwd() + '/test-reports';

let preprocessors = {};
preprocessors[filePath] = 'webpack';

let webpackConfig = require('./webpack.conf.js')();
webpackConfig.module.loaders.push({ test: /\.js$/, exclude: /(test|node_modules)\//, loader: require.resolve('isparta-loader') });

module.exports = function(config) {
    config.set(Object.assign({
        singleRun: true,
        browsers: ['PhantomJS'],    // 'Chrome', 'Firefox', 'IE', 'IE9', 'IE8'
        frameworks: ['mocha', 'expect'],
        files: [
            './node_modules/babel-polyfill/dist/polyfill.min.js',
            filePath,
        ],
        preprocessors: preprocessors,
        webpack: webpackConfig,
        webpackMiddleware: { noInfo: true },
        reporters: ['nyan', 'coverage'],
        coverageReporter: {
            dir: `${reportsPath}/coverage`,
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text' },
            ],
        },
        // htmlReporter: {
        //     outputDir: `${reportsPath}/result`
        // }
    }, settings.karma));
};
