'use strict';

let gulp = require('gulp');
let program = gulp.program || {};

let sequence = require('run-sequence');
let rm = require('gulp-rimraf');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let minifycss = require('gulp-minify-css');
let mcss = require('gulp_mcss');
let webpack = require('gulp-webpack');

let webpackConf = require('../../webpack.conf.js');

// @TODO: JS和MCSS流程统一

gulp.task('dist-clean', (done) => {
    return gulp.src('./dist', {read: false}).pipe(rm());
});

const distJS = function(watch) {
    return (done) => {
        return gulp.src('./index.js')
            .pipe(webpack(webpackConf({
                watch,
                output: {
                    filename: 'index.js',
                    library: program.library || 'RGUI',
                    libraryTarget: 'umd'
                },
                devtool: program.devtool,
            })))
            .pipe(gulp.dest('./dist/js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('./dist/js'));
    }
}

gulp.task('dist-js', distJS(false));
gulp.task('dist-js-watch', distJS(true));

gulp.task('dist-css', (done) => {
    return gulp.src('./index.mcss')
        .pipe(mcss({
            watch: true,
            pathes: [__dirname + '/../../node_modules/mass', './node_modules'],
            importCSS: true
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('dist-css-watch', ['dist-css'], (done) => {
    gulp.watch('**/*.mcss', ['dist-css']);
});

gulp.task('dist-build', ['dist-js', 'dist-css']);
gulp.task('dist-watch', ['dist-js-watch', 'dist-css-watch']);

gulp.task('dist', (done) => {
    if(program.watch)
        sequence('dist-clean', 'dist-watch', done);
    else
        sequence('dist-clean', 'dist-build', done);
});
