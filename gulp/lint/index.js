'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const program = gulp.program || {};

const eslint = require('gulp-eslint');
const eslintConfig = require('../../.eslintrc.js');
if(program.fix)
    eslintConfig.fix = true;
if(program.tests) {
    eslintConfig.envs.push('mocha');
    eslintConfig.globals.push('expect');
}

const SRC_PATHES = ['*.js', '*/*.js', '!node_modules/**', '!doc/**', '!dist/**', '!test-reports/**'];
const TEST_PATHES = ['*/test/*.js', '!node_modules/**', '!doc/**', '!dist/**', '!test-reports/**'];

gulp.task('lint', (done) => {
    return gulp.src(program.tests ? TEST_PATHES : SRC_PATHES)
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        .pipe(gulpIf((file) => file.eslint !== null && file.eslint.fixed, gulp.dest('.')))
        .pipe(eslint.failAfterError());
});

gulp.task('lint-watch', (done) => {
    gulp.watch(SRC_PATHES, ['lint']);
});
