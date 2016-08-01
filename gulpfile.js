'use strict';

const gulp = require('gulp');
const sequence = require('run-sequence');

// require('./gulp/doc/index.js');
// require('./gulp/cache/index.js');
// require('./gulp/lint/index.js');

// gulp.task('dev', ['doc-watch', 'cache-watch', 'lint-watch']);

// gulp.task('doc', (done) => {
//     sequence(['cache-clean', 'doc-clean'], ['doc-build', 'cache-build'], done);
// });


require('./gulp/build');

