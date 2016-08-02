'use strict';

const gulp = require('gulp');
const sequence = require('run-sequence');

// require('./gulp/cache/index.js');

require('./gulp/lint');
require('./gulp/build');

gulp.task('dev', ['build', 'lint']);
gulp.task('online', ['build']);

// gulp.task('doc', (done) => {
//     sequence(['cache-clean', 'doc-clean'], ['doc-build', 'cache-build'], done);
// });



