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

gulp.task('build-clean', (done) => {
    return gulp.src(program.dest, {read: false}).pipe(rm());
});

gulp.task('build-js', (done) => {
    const webpackConfig = webpackConf(program.webpack);
    if (program.watch) {
        webpackConfig.watch = true;
        webpackConfig.devtool = 'eval';
    }

    const stream = gulp.src(program.src + '/page/*/index.js')
        .pipe(fixEntry(webpackConfig))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(program.dest + '/js'));

    if (program.compress) {
        stream.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(program.dest + '/js'));
    }

    return stream;
});

gulp.task('build-css', (done) => {
    const stream = gulp.src(program.src + '/page/*/index.mcss')
        .pipe(mcss(Object.assign({
            pathes: [__dirname + '/../../node_modules/mass', './node_modules'],
            importCSS: true,
        }, program.mcss)))
        .pipe(flatPath())
        .pipe(gulp.dest(program.dest + '/css'));

    if (program.compress) {
        stream.pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(program.dest + '/css'));
    }

    return stream;
});
gulp.task('build-css-watch', ['build-css'], (done) => gulp.watch('**/*.mcss', ['build-css']));

gulp.task('build', (done) => {
    if (program.watch)
        sequence('build-clean', ['build-js', 'build-css-watch'], done);
    else
        sequence('build-clean', ['build-js', 'build-css'], done);
});
