'use strict';

const gulp = require('gulp');
const program = gulp.program || {};

const sequence = require('run-sequence');
const rm = require('gulp-rimraf');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-minify-css');
const mcss = require('gulp_mcss');
const webpack = require('gulp-webpack');

const fixEntry = require('./gulp-fix-entry.js');
const flatPath = require('./gulp-flat-path.js');

const webpackConf = require('../../webpack.conf.js');

// @TODO: JS和MCSS流程统一

/**
 * Clean dest files
 */
gulp.task('build-clean', (done) => {
    return gulp.src(program.dest, {read: false}).pipe(rm());
});

/**
 * Copy assets
 */
gulp.task('build-copy', (done) => {
    return gulp.src(program.src + '/assets/**').pipe(gulp.dest(program.dest));
});
gulp.task('build-copy-watch', ['build-copy'], (done) => gulp.watch(program.src + '/assets/**', ['build-copy']));

/**
 * Copy pages
 */
gulp.task('build-page', (done) => {
    return gulp.src(program.src + '/page/*/index.html')
        .pipe(flatPath())
        .pipe(gulp.dest(program.dest));
});
gulp.task('build-page-watch', ['build-page'], (done) => gulp.watch(program.src + '/page/**/index.html', ['build-page']));

/**
 * Build JS
 */
gulp.task('build-js', (done) => {
    const webpackConfig = webpackConf(program.webpack);
    if (program.watch) {
        webpackConfig.watch = true;
        webpackConfig.devtool = 'eval';
    }

    const stream = gulp.src('./' + program.src + '/page/**/index.js')
        .pipe(fixEntry(webpackConfig))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(program.dest + '/js'));

    if (program.compress || program.online) {
        stream.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./' + program.dest + '/js'));
    }

    return stream;
});
gulp.task('build-js-watch', ['build-js']);

/**
 * Build CSS
 */
gulp.task('build-css', (done) => {
    const stream = gulp.src('./' + program.src + '/page/**/index.mcss')
        .pipe(mcss({
            pathes: [__dirname + '/../../node_modules/mass', './node_modules'],
            importCSS: true,
        }))
        .pipe(flatPath())
        .pipe(gulp.dest(program.dest + '/css'));

    if (program.compress || program.online) {
        stream.pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./' + program.dest + '/css'));
    }

    return stream;
});
gulp.task('build-css-watch', ['build-css'], (done) => gulp.watch(program.src + '/**/*.mcss', ['build-css']));

/**
 * Build
 */
gulp.task('build', (done) => {
    if (program.watch)
        sequence('build-clean', ['build-copy-watch', 'build-page-watch', 'build-js-watch', 'build-css-watch'], done);
    else
        sequence('build-clean', ['build-copy', 'build-page', 'build-js', 'build-css'], done);
});
