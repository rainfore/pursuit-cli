'use strict';

let gulp = require('gulp');
let sequence = require('run-sequence');
let ghpages = require('gh-pages');

require('./gulp/doc/index.js');
require('./gulp/cache/index.js');
require('./gulp/lint/index.js');

gulp.task('dev', ['doc-watch', 'cache-watch', 'lint-watch']);

gulp.task('doc', (done) => {
    sequence(['cache-clean', 'doc-clean'], ['doc-build', 'cache-build'], done);
});

gulp.task('gh-pages', (done) => {
    ghpages.clean();
    ghpages.publish('doc', {
        src: ['**/*', '!**/__*']
    }, function(err) {
        if(err)
            console.error(err);
        else
            console.log('gh-pages have been pushed.');
        done();
    });
});

