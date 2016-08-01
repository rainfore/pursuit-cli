'use strict';

let gulp = require('gulp');
let rm = require('gulp-rimraf');

let build = require('./gulp-build.js');

gulp.task('doc-clean', (done) => {
    return gulp.src('./doc', {read: false}).pipe(rm());
});

gulp.task('doc-build', (done) => {
    return gulp.src('*/demo/*.md')
        .pipe(build())
        .pipe(gulp.dest('./doc'));
});

gulp.task('doc-watch', ['doc-build'], (done) => {
    gulp.watch('*/demo/*.md', ['doc-build']);
});
