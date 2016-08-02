'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const fs = require('fs');
const sequence = require('run-sequence');
const program = gulp.program || {};

const eslint = require('gulp-eslint');
let eslintConfig;
const cwdLintConfPath = process.cwd() + '/.eslintrc.js';
if (fs.existsSync(cwdLintConfPath))
    eslintConfig = require(cwdLintConfPath);
else
    eslintConfig = require('../../.eslintrc.js');

if(program.fix)
    eslintConfig.fix = true;

const SRC_PATHES = [program.src + '/**/*.js'];

gulp.task('lint-run', (done) => {
    const stream = gulp.src(SRC_PATHES)
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        .pipe(gulpIf((file) => file.eslint !== null && file.eslint.fixed, gulp.dest(program.src + '/')));

    if(!program.watch)
        stream.pipe(eslint.failAfterError());

    return stream;
});

gulp.task('lint-watch', ['lint-run'], (done) => gulp.watch(SRC_PATHES, ['lint-run']));

gulp.task('lint', (done) => {
    if (program.watch)
        sequence('lint-watch', done);
    else
        sequence('lint-run', done);
})
