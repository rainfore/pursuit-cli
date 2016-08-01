'use strict';

let gulp = require('gulp');

let rm = require('gulp-rimraf');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let minifycss = require('gulp-minify-css');
let mcss = require('gulp_mcss');
let webpack = require('gulp-webpack');

let jsEntry = require('./gulp-js-entry.js');
let cssEntry = require('./gulp-css-entry.js');
let webpackConf = require('../../webpack.conf.js');

gulp.task('cache-clean', (done) => {
    return gulp.src('./.rgui-cache', {read: false}).pipe(rm());
});

/**
 * js tasks
 */
// gulp.task('cache-js-index-pack', (done) => {
//     return gulp.src('./package.json')
//         .pipe(jsEntry())
//         .pipe(gulp.dest('./.rgui-cache/js'));
// });

function cacheJS(watch) {
    return (done) => {
        return gulp.src('./package.json')
            .pipe(jsEntry())
            .pipe(gulp.dest('./.rgui-cache/js'))
            .pipe(webpack(webpackConf({watch, devtool: 'eval'})))
            .pipe(gulp.dest('./doc/js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('./doc/js'));
    }
}

gulp.task('cache-js', cacheJS(false));
gulp.task('cache-js-watch', cacheJS(true));

/**
 * css tasks
 */
// gulp.task('cache-css-index-pack', (done) => {
//     return gulp.src(__dirname + '/cache/css/index.mcss')
//         .pipe(gulp.dest('./.rgui-cache/css'));
// });

// gulp.task('cache-css-index-pack', ['cache-css-index-copy'], (done) => {
//     return gulp.src('./.rgui-cache/css/index.mcss')
//         .pipe(cssEntry())
//         .pipe(gulp.dest('./doc/css'));
// });

gulp.task('cache-css', (done) => {
    return gulp.src('./package.json')
        .pipe(cssEntry())
        .pipe(gulp.dest('./.rgui-cache/css'))
        .pipe(mcss({
            pathes: [__dirname + '/../../node_modules/mass', __dirname, './node_modules'],
            importCSS: true
        }))
        .pipe(gulp.dest('./doc/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./doc/css'));
});
gulp.task('cache-css-watch', ['cache-css'], (done) => {
    gulp.watch('**/*.mcss', ['cache-css']);
});

/**
 * export tasks
 */
gulp.task('cache-build', ['cache-js', 'cache-css']);
gulp.task('cache-watch', ['cache-js-watch', 'cache-css-watch']);
