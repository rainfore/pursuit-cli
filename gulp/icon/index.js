'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const rm = require('gulp-rimraf');
const replace = require('gulp-replace');
const all = require('gulp-all');
const gulpIf = require('gulp-if');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-imagemin');
const cssURLVersion = require('gulp-css-urlversion');
const fontcustom = require('gulp_fontcustom');

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
            const name = 'i-' + folder;
            const options = {
                cssSpritesheetName: name,
                imgName: name + '.png',
                cssName: name + '.css',
                imgPath: `../img/${name}.png`,
                cssTemplate: __dirname + '/spritesmith.hbs',
            };

            const retina = fs.readdirSync(pngPath + '/' + folder).some((file) => file.endsWith('@2x.png'));
            if (retina) {
                Object.assign(options, {
                    retinaSrcFilter: `${pngPath}/${folder}/*@2x.png`,
                    retinaImgName: name + '@2x.png',
                    retinaImgPath: `../img/${name}@2x.png`,
                });
            }

            const stream = gulp.src(`${pngPath}/${folder}/*.png`)
                .pipe(spritesmith(options));

            return new Promise((resolve, reject) => {
                stream.img
                    .pipe(buffer())
                    .pipe(imagemin())
                    .pipe(gulp.dest(settings.dest + '/img'))
                    .on('end', () =>
                stream.css
                    .pipe(cssURLVersion({ baseDir: settings.dest + '/img' }))
                    .pipe(gulp.dest(cssPath))
                    .on('end', () =>
                resolve()));
            });
        }));
});
gulp.task('icon-sprite-watch', ['icon-sprite'], (done) => gulp.watch(pngPath, ['icon-sprite']));

/**
 * Icon Font
 * gulp-iconfont插件不好用，生成的图标会有[Bubbling](https://github.com/nfroidure/svgicons2svgfont/issues/57)问题
 * 但fontcustom只能在非Windows系统下使用
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
                    preprocessor_path: '../fonts',
                    templates: 'preview ' + __dirname + '/fontcustom.css',
                }))
                .pipe(gulpIf('*.css', gulp.dest(cssPath), gulp.dest(settings.dest + '/fonts')));
        }));
});
gulp.task('icon-font-watch', ['icon-font'], (done) => gulp.watch(svgPath, ['icon-font']));

/**
 * Icon
 */
if (settings.watch)
    gulp.task('icon', ['icon-sprite-watch', 'icon-font-watch']);
else
    gulp.task('icon', ['icon-sprite', 'icon-font']);

