'use strict';

let fs = require('fs');
let path = require('path');
let gutil = require('gulp-util');
let File = gutil.File;
let PluginError = gutil.PluginError;
let through2 = require('through2');

module.exports = function(filename, options) {
    if (!filename)
        throw new PluginError('gulp-concat-import', 'Missing filename');
    options = Object.assign({}, options || {});

    let pathes = [];
    let lastFile = null;

    return through2.obj(function(file, enc, cb) {
        if(file.isStream())
            throw new PluginError('gulp-concat-import', 'Streaming not supported');

        pathes.push(file.path);
        lastFile = file;

        cb();
    }, function(cb) {
        if(!lastFile)
            return cb();

        let contents = new Buffer(pathes.map((filepath) => `import '${filepath}';\n`).join(''));

        let file = new File({
            cwd: lastFile.cwd,
            base: lastFile.base,
            path: path.join(lastFile.base, filename),
            contents
        });

        this.push(file);
        cb();
    });
}
