'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const fs = require('fs');
const sequence = require('run-sequence');

const eslint = require('gulp-eslint');
const eslintConfig = {};
const eslintReg = /^\.eslintrc(\.js|\.yaml|\.yml|\.json|)$/;

if(settings.fix)
    eslintConfig.fix = true;

/**
 * Lint Run
 */
gulp.task('lint-run', (done) => {
    if (!fs.readdirSync(process.cwd()).some((filename) => eslintReg.test(filename))) {
        console.log('Cannot find `.eslintrc` file, and skip `lint` task');
        return done();
    }

    let stream = gulp.src(settings.src + '/**/*.js')
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format());

    if(settings.fix)
        stream = stream.pipe(gulpIf((file) => file.eslint !== null && file.eslint.fixed, gulp.dest(settings.src)));

    if(!settings.watch)
        stream = stream.pipe(eslint.failAfterError());

    return stream;
});
gulp.task('lint-watch', ['lint-run'], (done) => gulp.watch(settings.src + '/**/*.js', ['lint-run']));

/**
 * Lint
 */
gulp.task('lint', [settings.watch ? 'lint-watch' : 'lint-run']);

