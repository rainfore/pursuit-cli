'use strict';

let gutil = require('gulp-util');
let PluginError = gutil.PluginError;
let through2 = require('through2');

module.exports = function(component) {
    return through2.obj((file, enc, cb) => {
        if (file.isNull())
            return cb(null, file);
        else if(file.isStream())
            throw new PluginError('gulp-build', 'Streaming not supported');

        let contents = file.contents + '';
        contents = contents.replace(/Sample/g, component.name).replace(/sample/g, component.lowerName);
        file.contents = new Buffer(contents);
        cb(null, file);
    });
}
