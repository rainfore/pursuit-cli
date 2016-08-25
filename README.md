# PURSUIT CLI

CLI for the PURSUIT framework.

## Commands

- `pursuit help`：查看帮助
- `pursuit init <repo>`：初始化一个仓库

以下命令在仓库目录下运行：

- `pursuit build`：构建项目。将入口MCSS文件和JS文件放置在`src/page`目录中。
- `pursuit doc`：生成文档（待完善）。将Markdown文档写在每个组件的`demo`目录中。
- `pursuit test`：运行测试。将单元测试写在每个组件的`test`目录中。
- `pursuit lint`：验证代码风格
    - `-f, --fix`：验证时自动修复
- `pursuit icon`：生成CSS Sprites和字体图标。将雪碧图的原始图标放在`src/icons/png`目录中，雪碧图会生成在`dest/img`目录中，对应的CSS会生成在`src/icons/css`目录中；将字体的原始图标放置在`src/icons/svg`目录中，字体和预览网页会生成在`dest/fonts`目录中，对应的CSS会生成在`src/icons/css`目录中。
    目前的已知问题：
    - 生成字体图标只支持Mac和Linux环境；
    - 生成雪碧图用`node 6`时好像会报错，请使用`node 4`；
    - 字体图标暂不支持多文件。
- `-w, --watch`：监听文件变更。上面4种命令都可以配置该选项。
- `-v, --verbose`：输出详细信息
- `-V, --version`：当前版本

集成命令：

- `pursuit dev`：相当于`pursuit build+doc+lint --watch --fix`，始终监听文件，自动修复lint问题。
- `pursuit online`：相当于`pursuit build+test+lint`，永不监听文件。
