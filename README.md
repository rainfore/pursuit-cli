# PURSUIT CLI

CLI for the PURSUIT framework.

> PURSUIT: A Fast, Advanced and Componentized Front-end Framework, which integrated with:
>
> es6 + babel + web`P`ack + g`U`lp + `R`egular + mcs`S` + rg`UI` + eslin`T` + stateman + karma + mocha + expect.js + spritesmith + fontcustom + ...

[![NPM Version][npm-img]][npm-url]
[![Dependencies][david-img]][david-url]
[![NPM Download][download-img]][download-url]

[npm-img]: http://img.shields.io/npm/v/pursuit-cli.svg?style=flat-square
[npm-url]: http://npmjs.org/package/pursuit-cli
[david-img]: http://img.shields.io/david/rainfore/pursuit-cli.svg?style=flat-square
[david-url]: https://david-dm.org/rainfore/pursuit-cli
[download-img]: https://img.shields.io/npm/dm/pursuit-cli.svg?style=flat-square
[download-url]: https://npmjs.org/package/pursuit-cli

http://rainfore.me/pursuit is not only a home page for PURSUIT but also a simple demo built by PURSUIT.

## Install

```shell
npm install -g pursuit-cli
```

## QuickStart

```shell
pursuit init demo
cd demo
npm install
pursuit dev
```

## Commands

- `pursuit help`：查看帮助
- `pursuit init <repo>`：初始化一个仓库

以下命令在仓库目录下运行：

- `pursuit build`：构建项目。需要将入口MCSS文件和JS文件放置在`src/page`目录中。
- `pursuit doc`：生成文档（待完善）。需要将Markdown文档写在每个组件的`demo`目录中。
- `pursuit lint`：验证代码风格。需要在运行目录中配置`.eslintrc`文件。
    - `-f, --fix`：验证时自动修复
- `pursuit icon`：生成雪碧图（CSS Sprites）和字体图标（Font Icons），为了支持大型项目，所以按照多组图标来生成。在`src/icons/png`目录中的每一个文件夹为一组雪碧图的原始图标，在`src/icons/svg`目录中的每一个文件夹为一组字体图标的原始图标，生成的文件名和选择器都按此文件夹命名。比如将一组雪碧图的原始图标放在`src/icons/png/sprite/`目录中，运行命令后，雪碧图会生成为`dest/img/i-sprite.png`，对应的CSS会生成为`src/icons/css/i-sprite.css`；将字体的原始图标放置在`src/icons/svg/font/`目录中，运行命令后，字体和预览网页会生成在`dest/fonts`目录中，对应的CSS会生成为`src/icons/css/i-font.css`。
    - 雪碧图也支持Retina@2x图，只需在每组原始图标文件夹中放入与@1x图对应的@2x图即可。比如在`src/icons/png/sprite/`目录中有若干`*.png`，再放入对应2倍大小的`*@2x.png`图，数量一定要保持一致。
    - 字体图标只支持在Mac和Linux环境下生成，并且需要安装以下包，详见：[FontCustom](https://github.com/FontCustom/fontcustom/#installation)；
    ```shell
    # On Mac
    brew install fontforge --with-python
    brew install eot-utils
    brew install woff2
    gem install fontcustom
    ```

- `-w, --watch`：监听文件变更。以上命令都可以配置此选项（默认不会监听）。
- `-v, --verbose`：输出详细信息
- `-V, --version`：当前版本

集成命令：

- `pursuit dev`：构建项目+生成文档+验证代码风格，始终监听文件，自动修复lint问题。相当于`pursuit build,doc,lint --watch --fix`。考虑到`icon`命令使用频率不高，并且某些开发者在Windows下无法使用，所以暂不加入`dev`命令中。
- `pursuit clean`：手动清理所有pursuit命令生成的文件（以上命令默认不会清理生成的文件）。相当于`pursuit build-clean,doc-clean,icon-clean`。
- `pursuit online`：清理文件->生成图标->构建项目->运行测试->验证代码风格，永不监听文件。相当于`pursuit clean->icon->build->lint`。
