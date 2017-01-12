'use strict';

const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const sequence = require('run-sequence');
const rm = require('gulp-rimraf');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-minify-css');
const mcss = require('gulp_mcss');
const webpack = require('gulp-webpack');
const replace = require('gulp-replace');

const fixEntry = require('./gulp-fix-entry.js');
const flatPath = require('./gulp-flat-path.js');

const webpackConf = require('../../webpack.conf.js');

// @TODO: JS和MCSS流程统一

/**
 * Build Clean
 */
gulp.task('build-clean', (done) => {
    return gulp.src(settings.dest, { read: false }).pipe(rm());
});

/**
 * Copy assets
 */
gulp.task('build-copy', (done) => {
    return gulp.src(settings.src + '/assets/**').pipe(gulp.dest(settings.dest));
});
gulp.task('build-copy-watch', ['build-copy'], (done) => gulp.watch(settings.src + '/assets/**', ['build-copy']));

/**
 * Copy pages
 */
gulp.task('build-page', (done) => {
    let stream = gulp.src(settings.pageExts.map((ext) => settings.src + '/page/*/index.' + ext))
        .pipe(flatPath());

    if(settings.noCache || settings.online) {
        // 添加版本号
        const version = new Date().toJSON().replace(/[^\d]/g, '');
        const pages = fs.readdirSync(settings.src + '/page').filter((dirname) => dirname[0] !== '.').join('|');
        const cssReg = new RegExp(`(<link.+?href=.+?css\\/(?:${pages})\\.css)(.+?>)`, 'g');
        const jsReg = new RegExp(`(<script.+?src=.+?js\\/(?:${pages})\\.js)(.+?>)`, 'g');

        stream.pipe(replace(cssReg, `$1?${version}$2`))
              .pipe(replace(jsReg, `$1?${version}$2`));
    }

    return stream.pipe(gulp.dest(settings.dest));
});
gulp.task('build-page-watch', ['build-page'], (done) => gulp.watch(settings.src + '/page/**/index.html', ['build-page']));

/**
 * Build JS
 */
gulp.task('build-js', (done) => {
    const webpackConfig = webpackConf();

    if (settings.watch) {
        webpackConfig.watch = true;
        webpackConfig.devtool = 'eval-source-map';
    }

    let stream = gulp.src(settings.src + '/page/*/index.js')
        .pipe(fixEntry(webpackConfig))
        .pipe(webpack(webpackConfig));

    if (settings.compress || settings.online) {
        // stream = stream.pipe(rename({ suffix: '.min' }))
        stream = stream.pipe(uglify());
    }

    return stream.pipe(gulp.dest(settings.dest + '/js'));
});
gulp.task('build-js-watch', ['build-js']);

/**
 * Build CSS
 */
gulp.task('build-css', (done) => {
    let stream = gulp.src(settings.src + '/page/*/index.mcss')
        .pipe(mcss({
            pathes: [__dirname + '/../../node_modules/mass', './node_modules'],
            importCSS: true,
        }))
        .pipe(flatPath());

    if (settings.compress || settings.online) {
        // stream = stream.pipe(rename({ suffix: '.min' }))
        stream = stream.pipe(minifycss());
    }

    return stream.pipe(gulp.dest(settings.dest + '/css'));
});
gulp.task('build-css-watch', ['build-css'], (done) => gulp.watch(settings.src + '/**/*.mcss', ['build-css']));

/**
 * Build
 */
if (settings.watch)
    gulp.task('build', ['build-copy-watch', 'build-page-watch', 'build-js-watch', 'build-css-watch']);
else
    gulp.task('build', ['build-copy', 'build-page', 'build-js', 'build-css']);
