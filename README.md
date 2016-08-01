# Developer Tools for Regular UI
## Commands

- `rgui-tools help`：查看帮助
- `rgui-tools init -c <components> <repo>`：初始化一个仓库

以下命令在仓库目录下（如`./ui-sample`）运行：

- `rgui-tools watch`：监听js、mcss和md等文件，实时更新脚本、样式和文档。
- `rgui-tools doc`：先清理`./doc`目录，然后重新生成文档。
- `rgui-tools gh-pages`：将`./doc`目录下的文档发布到该仓库的`gh-pages`中。
- `rgui-tools dist`：生成打包文件（会先清理`./dist`目录）。
    - `-l, --library`：库的命名空间
- `rgui-tools test`：运行测试（默认监听）
    - `-s, --single-run`：只运行一遍测试
    - `-O, --online`：线上模式
- `rgui-tools lint`：验证代码风格
    - `-f, --fix`：验证时自动修复
- `rgui-tools publish`（未完成）：修改version，提交代码，打tag，然后发布npm版本。
