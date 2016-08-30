'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const sequence = require('run-sequence');
const rm = require('gulp-rimraf');
const replace = require('gulp-replace');
const all = require('gulp-all');
const gulpIf = require('gulp-if');
const sprity = require('sprity');
const fontcustom = require('gulp-fontcustom');

// @TODO: 让用户可以直接配置到dest目录下
const cssPath = settings.src + '/icons/css';
const pngPath = settings.src + '/icons/png';
const svgPath = settings.src + '/icons/svg';

/**
 * Icon Clean
 */
gulp.task('icon-clean', () => {
    return gulp.src(cssPath, { read: false }).pipe(rm());
});

/**
 * Icon Sprite
 */
gulp.task('icon-sprite', (done) => {
    if(!fs.existsSync(pngPath)) {
        console.log('Cannot find `src/icons/png` directory, and skip `icon-sprite` task');
        return done();
    }

    return all(fs.readdirSync(pngPath)
        .filter((folder) => folder[0] !== '.' && fs.statSync(path.join(pngPath, folder)).isDirectory())
        .map((folder) => {
            return sprity.src({
                src: `${pngPath}/${folder}/*.png`,
                style: `i-${folder}.css`,
                cssPath: '../img',
                name: `i-${folder}`,
                margin: 0,
                prefix: `i-${folder}`,
                'style-indent-size': 4,
                template: __dirname + '/sprity.hbs',
            })
            .pipe(gulpIf('*.css', gulp.dest(cssPath), gulp.dest(settings.dest + '/img')));
        }));
});
gulp.task('icon-sprite-watch', ['icon-sprite'], (done) => gulp.watch(pngPath, ['icon-sprite']));

/**
 * Icon Font
 */
gulp.task('icon-font', (done) => {
    if(!fs.existsSync(svgPath)) {
        console.log('Cannot find `src/icons/svg` directory, and skip `icon-font` task');
        return done();
    }

    return all(fs.readdirSync(svgPath)
        .filter((folder) => folder[0] !== '.' && fs.statSync(path.join(svgPath, folder)).isDirectory())
        .map((folder) => {
            return gulp.src(`${svgPath}/${folder}`)
                .pipe(fontcustom({
                    font_name: `i-${folder}`,
                    'css-selector': `.i-${folder}-{{glyph}}`,
                }))
                // 替换fontcustom生成CSS里的一些问题
                .pipe(gulpIf('*.css', replace(/url\("\.\//g, 'url("../fonts/')))
                .pipe(gulpIf('*.css', replace(/\[data-icon\]/g, `.i-${folder}`)))
                .pipe(gulpIf('*.css', gulp.dest(cssPath), gulp.dest(settings.dest + '/fonts')));
        }));
});
gulp.task('icon-font-watch', ['icon-font'], (done) => gulp.watch(svgPath, ['icon-font']));

// iconfont插件不好用，生成的图标会有[Bubbling](https://github.com/nfroidure/svgicons2svgfont/issues/57)问题
// const iconfont = require('gulp-iconfont');
// const iconfontCSS = require('gulp-iconfont-css');

/* gulp.task('icon-font', () => {
    const svgPath = settings.src + '/icons/svg';

    return all(fs.readdirSync(svgPath).map((folder) => {
        return gulp.src(svgPath + '/' + folder + '/*.svg')
            .pipe(iconfontCssAndTemplate({
                fontName: folder,
                cssClass: `i-${folder}`,
                cssTargetPath: `${folder}.css`,
            }))
            .pipe(iconfont({
                fontName: folder,
                formats: ['ttf', 'eot', 'woff', 'svg'],
                prependUnicode: true,
                normalize: true,
            }))
            .pipe(gulp.dest(settings.src + '/icons/css'));
    }));
}); */

/**
 * Icon
 */
if (settings.watch)
    gulp.task('icon', ['icon-sprite-watch', 'icon-font-watch']);
else
    gulp.task('icon', ['icon-sprite', 'icon-font']);

