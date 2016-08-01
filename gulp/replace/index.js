'use strict';

let gulp = require('gulp');
let program = gulp.program || {};
let all = require('gulp-all');

let replace = require('./gulp-replace');

gulp.task('replace', (done) => {
    return gulp.src('./**')
        .pipe(replace(program.components[0]))
        .pipe(gulp.dest('.'));
});
