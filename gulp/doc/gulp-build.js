'use strict';

let gutil = require('gulp-util');
let PluginError = gutil.PluginError;
let chalk = require('chalk');
let through2 = require('through2');

let fs = require('fs');
let path = require('path');

let ejs = require('ejs');
let babel = require('babel-core');
let babelConfig = require('../../babelrc.js');
let templates = require('./views.js');
let premark = require('./premark.js');
let markdown = require('./markdown.js');
let jsAPI = require('./js-api.js');

module.exports = function(options) {
    options = options || {verbose: true};

    return through2.obj((file, enc, cb) => {
        // 目前只为*.md的生成页面

        if (file.isNull())
            return cb(null, file);
        else if(file.isStream())
            throw new PluginError('gulp-build', 'Streaming not supported');

        let jsonpath = path.join(file.path, '../../index.json');

        let data = {
            assetsPath: 'https://regular-ui.github.io/v0.2/',
            name: '',
            zhName: '',
            content: '',
            script: '',
            api: '',
        };

        // 获取index.json中的基本信息
        if(fs.existsSync(jsonpath))
            data = Object.assign(data, JSON.parse(fs.readFileSync(jsonpath, 'utf-8')));

        data.content = file.contents.toString();
        let tpl = templates.head + '<div class="g-bd"><div class="g-bdc">' + templates.main + '</div></div>' + templates.foot;

        // 对markdown中的示例进行预处理
        let result = premark.premark(data.content);
        try {
            data.script = babel.transform(result.script, babelConfig).code;
        } catch(e) {
            data.script = result.script;
            console.error('Babel transform error:', e, file.path);
        }
        data.content = markdown(result.content);

        // 如果当前文件为index.md，并且组件有js代码，则生成api
        let jspath = path.join(file.path, '../../index.js');
        if(file.path.endsWith('/index.md') && fs.existsSync(jspath))
            data.api = jsAPI.render(jspath, templates['js-api']);

        let html;
        try {
            html = ejs.render(tpl, data);
        } catch(e) {
            html = tpl;
            console.error('Render ejs error:', e, file.path);
        }

        // 变更路径，修改file
        file.base = file.cwd;
        file.path = file.path.replace(/demo\/(.+)\.md$/, '$1.html');
        file.contents = new Buffer(html);

        options.verbose && console.log('[' + chalk.grey(new Date().toLocaleTimeString()) + ']', chalk.blue('Building'), 'doc/' + path.relative(file.base, file.path));

        cb(null, file);
    });
}
