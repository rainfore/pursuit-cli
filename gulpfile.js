'use strict';

const gulp = require('gulp');
// require('./gulp/cache/index.js');

require('./gulp/build');
require('./gulp/lint');
require('./gulp/doc');

gulp.task('dev', ['build', 'lint', 'doc']);
gulp.task('online', ['build']);



