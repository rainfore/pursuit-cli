'use strict';

const gulp = require('gulp');
const sequence = require('run-sequence');

require('./gulp/build');
require('./gulp/lint');
require('./gulp/doc');
require('./gulp/test');

gulp.task('dev', ['build', 'lint', 'doc']);
gulp.task('online', () => sequence('build', 'test', 'lint'));
