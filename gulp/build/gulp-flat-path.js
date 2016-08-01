'use strict';

const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const through2 = require('through2');

module.exports = function (webpackConfig) {
    const entry = {};

    return through2.obj(function (file, enc, cb) {
        if(file.isStream())
            throw new PluginError('gulp-flat-path', 'Streaming not supported');

        const reg = /page(\\|\/)(.*)(?:\\|\/)index/;
        file.path = file.path.replace(reg, (m, slash, name) => `page${slash}${name}`);

        console.log('mcss', file.path);

        cb(null, file);
    });
}
