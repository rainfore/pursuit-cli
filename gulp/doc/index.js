'use strict';

const gulp = require('gulp');
const rm = require('gulp-rimraf');
const sequence = require('run-sequence');

const build = require('./gulp-build.js');

/**
 * Doc clean
 */
gulp.task('doc-clean', (done) => {
    // return gulp.src('./doc', {read: false}).pipe(rm());
});

/**
 * Doc build
 */
gulp.task('doc-build', (done) => {
    return gulp.src(settings.src + '/**/demo/*.md')
        .pipe(build({
            dest: settings.dest,
            library: settings.library,
        }))
        .pipe(gulp.dest('.'));
});
gulp.task('doc-watch', ['doc-build'], (done) => gulp.watch(settings.src + '/**/*.md', ['doc-build']));

/**
 * Doc
 */
gulp.task('doc', [settings.watch ? 'doc-watch' : 'doc-build']);
