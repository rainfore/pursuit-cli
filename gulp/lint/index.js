'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const fs = require('fs');
const sequence = require('run-sequence');

const eslint = require('gulp-eslint');
let eslintConfig = require('../../.eslintrc.js');

if(settings.fix)
    eslintConfig.fix = true;

/**
 * Lint Run
 */
gulp.task('lint-run', (done) => {
    const stream = gulp.src(settings.src + '/**/*.js')
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        .pipe(gulpIf((file) => file.eslint !== null && file.eslint.fixed, gulp.dest(settings.src)));

    if(!settings.watch)
        stream.pipe(eslint.failAfterError());

    return stream;
});
gulp.task('lint-watch', ['lint-run'], (done) => gulp.watch(settings.src + '/**/*.js', ['lint-run']));

/**
 * Lint
 */
gulp.task('lint', [settings.watch ? 'lint-watch' : 'lint-run']);

