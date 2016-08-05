'use strict';

const gulp = require('gulp');
const rm = require('gulp-rimraf');
const sequence = require('run-sequence');

const build = require('./gulp-build.js');

// gulp.task('doc-clean', (done) => {
//     return gulp.src('./doc', {read: false}).pipe(rm());
// });

gulp.task('doc-build', (done) => {
    return gulp.src(settings.src + '/**/demo/*.md')
        .pipe(build({
            dest: settings.dest,
            library: settings.library,
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('doc-watch', ['doc-build'], (done) => {
    gulp.watch(settings.src + '/**/*.md', ['doc-build']);
});

gulp.task('doc', (done) => {
    if (settings.watch)
        sequence(['doc-watch'], done);
    else
        sequence(['doc-build'], done);
});
