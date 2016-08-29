'use strict';

const fs = require('fs');
const gulp = require('gulp');
const rm = require('gulp-rimraf');
const concatFilenames = require('gulp-concat-filenames');
const Server = require('karma').Server;

/**
 * Test clean
 */
gulp.task('test-clean', (done) => {
    return gulp.src(['./test-reports', './.pursuit-cache/test.js'], { read: false }).pipe(rm());
});

gulp.task('test-entry', ['test-clean'], (done) => {
    return gulp.src(settings.src + '/**/test/spec.js', { read: false })
        .pipe(concatFilenames('test.js', {
            template: (filename) => `import '${filename}';`,
        }))
        .pipe(gulp.dest('./.pursuit-cache'));
});

/**
 * Test
 */
gulp.task('test', ['test-entry'], (done) => {
    // 如果没有测试用例则直接跳过
    if (!fs.existsSync('./.pursuit-cache/test.js')) {
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
