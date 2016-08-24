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
- `-w, --watch`：监听文件变更。上面4种命令都可以配置该选项。
- `-v, --verbose`：输出详细信息
- `-V, --version`：当前版本

集成命令：

- `pursuit dev`：相当于`pursuit build+doc+lint --watch --fix`，始终监听文件，自动修复lint问题。
- `pursuit online`：相当于`pursuit build+test+lint`，永不监听文件。
