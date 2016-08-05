'use strict';

const gulp = require('gulp');
const Server = require('karma').Server;

const concatImport = require('./gulp-concat-import.js');

gulp.task('test-entry', (done) => {
    return gulp.src(config.src + '/**/test/*.js', { read: false })
        .pipe(concatImport('test.js'))
        .pipe(gulp.dest('./.pursuit-cache'));
});


gulp.task('test', ['test-entry'], (done) => {
    const conf = { configFile: require.resolve('../../karma.conf.js') };

    if (config.watch) {
        config.autoWatch = true;
        config.singleRun = false;
    }

    if (config.online) {
        config.singleRun = true;
        config.reporters = ['mocha', 'coverage', 'coveralls'];
    }

    if (config.verbose)
        config.webpackMiddleware = {};

    new Server(conf, (code) => process.exit(code)).start();
});
