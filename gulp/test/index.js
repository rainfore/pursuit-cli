'use strict';

const gulp = require('gulp');
const rm = require('gulp-rimraf');
const concatFilenames = require('gulp-concat-filenames');
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
        .pipe(gulp.dest('./.pursuit-cache'));
});

/**
 * Test
 */
gulp.task('test', ['test-clean', 'test-entry'], (done) => {
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

    new Server(config, (code) => process.exit(code)).start();
});
