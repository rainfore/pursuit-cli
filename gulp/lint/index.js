'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const fs = require('fs');
const sequence = require('run-sequence');

const eslint = require('gulp-eslint');
let eslintConfig = require('../../.eslintrc.js');

if(config.fix)
    eslintConfig.fix = true;

gulp.task('lint-run', (done) => {
    console.log(eslintConfig);
    const stream = gulp.src(config.src + '/**/*.js')
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        .pipe(gulpIf((file) => file.eslint !== null && file.eslint.fixed, gulp.dest(config.src)));

    if(!config.watch)
        stream.pipe(eslint.failAfterError());

    return stream;
});

gulp.task('lint-watch', ['lint-run'], (done) => gulp.watch(config.src + '/**/*.js', ['lint-run']));

gulp.task('lint', (done) => {
    if (config.watch)
        sequence('lint-watch', done);
    else
        sequence('lint-run', done);
})
