'use strict';

const gulp = require('gulp');
const Server = require('karma').Server;

const concatImport = require('./gulp-concat-import.js');

gulp.task('test-entry', (done) => {
    return gulp.src(settings.src + '/**/test/spec.js', { read: false })
        .pipe(concatImport('test.js'))
        .pipe(gulp.dest('./.pursuit-cache'));
});


gulp.task('test', ['test-entry'], (done) => {
    const conf = { configFile: require.resolve('../../karma.conf.js') };

    if (settings.watch) {
        settings.autoWatch = true;
        settings.singleRun = false;
    }

    if (settings.online) {
        settings.singleRun = true;
        settings.reporters = ['mocha', 'coverage', 'coveralls'];
    }

    if (settings.verbose)
        settings.webpackMiddleware = {};

    new Server(conf, (code) => process.exit(code)).start();
});
