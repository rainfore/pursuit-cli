'use strict';

let fs = require('fs');
let gutil = require('gulp-util');
let PluginError = gutil.PluginError;
let through2 = require('through2');

module.exports = function(options) {
    options = Object.assign({}, options || {});

    return through2.obj((file, enc, cb) => {
        if (file.isNull())
            return cb(null, file);
        else if(file.isStream())
            throw new PluginError('gulp-wrap', 'Streaming not supported');

        let contents = [`@import 'entry-css/index.mcss';\n`];

        try {
            let pkg = JSON.parse(file.contents.toString());
            for(let dependency in pkg.dependencies) {
                let mcsspath = `./node_modules/${dependency}/index.mcss`;
                if(/^rgui-/.test(dependency) && fs.existsSync(mcsspath))
                    contents.push(`@import '${dependency}/index.mcss';\n`);
            }
        } catch(e) {
            console.error(e);
        }
        if(fs.existsSync('./index.mcss'))
            contents.push(`@import '../../index.mcss';\n`);

        file.contents = new Buffer(contents.join(''));
        file.path = file.path.replace('package.json', 'index.mcss');
        cb(null, file);
    });
}
