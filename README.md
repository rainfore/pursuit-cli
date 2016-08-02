# PURSUIT CLI

CLI for the PURSUIT framework.

## Commands

- `pursuit help`：查看帮助
- `pursuit init <repo>`：初始化一个仓库

以下命令在仓库目录下运行：

- `pursuit build`：构建项目
- `pursuit doc`：生成文档
- `pursuit test`：运行测试
- `pursuit lint`：验证代码风格
    - `-f, --fix`：验证时自动修复

- `-w, --watch`：监听文件变更

集成命令：

- `pursuit dev`：相当于`pursuit build+doc+lint --watch`，并且始终监听文件
- `pursuit online`：相当于`pursuit build+test+lint`，并且永不监听文件





<!-- - `pursuit watch`：监听js、mcss和md等文件，实时更新脚本、样式和文档。
- `pursuit dist`：生成打包文件（会先清理`./dist`目录）。

    - `-s, --single-run`：只运行一遍测试
    - `-O, --online`：线上模式
 -->


