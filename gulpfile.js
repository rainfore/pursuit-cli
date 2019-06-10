'use strict';

const gulp = require('gulp');
const sequence = require('run-sequence');

require('./gulp/build');
require('./gulp/lint');
require('./gulp/doc');
require('./gulp/icon');

gulp.task('dev', ['build', 'lint', 'doc']);
gulp.task('clean', ['build-clean', 'doc-clean', 'icon-clean']);
gulp.task('online', (done) =>
    sequence('icon', 'build', done)); // , 'lint'
