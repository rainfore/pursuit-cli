'use strict';

const fs = require('fs');
const gulp = require('gulp');
const rm = require('gulp-rimraf');
const concatFilenames = require('gulp-concat-filenames');
const file = require('gulp-file');
const Server = require('karma').Server;

/**
 * Test clean
 */
gulp.task('test-clean', (done) => {
    return gulp.src('./test-reports', { read: false }).pipe(rm());
});

gulp.task('test-entry', (done) => {
    return gulp.src(settings.src + '/**/test/spec.js', { read: false })
        .pipe(concatFilenames('test.js', {
            template: (filename) => `import '${filename}';`,
        }))
        .pipe(file('test.js', '')) // 如果没有文件时产生一个文件。好像无需判断，自动不会覆盖前面的文件？
        .pipe(gulp.dest('./.pursuit-cache'));
});

/**
 * Test
 */
gulp.task('test', ['test-entry'], (done) => {
    const testEntry = fs.readFileSync('./.pursuit-cache/test.js', 'utf8') + '';
    if (!testEntry) {
        console.log('Cannot find any tests, and skip `test` task');
        return done();
    }

    const config = { configFile: require.resolve('../../karma.conf.js') };

    if (settings.watch) {
        config.autoWatch = true;
        config.singleRun = false;
    }

    if (settings.online) {
        config.singleRun = true;
        config.reporters = ['mocha', 'coverage', 'coveralls'];
    }

    if (settings.verbose)
        config.webpackMiddleware = {};

    new Server(config, (code) => done(code ? 'Test failed' : '')).start();
});
