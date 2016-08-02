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
            throw new PluginError('gulp-fix-entry', 'Streaming not supported');

        const reg = /page[\\\/](.*)[\\\/]index\.js$/;
        const name = file.path.match(reg)[1];
        entry[name] = file.path;

        cb();
    }, function (cb) {
        webpackConfig.entry = entry;
        cb();
    });
}
