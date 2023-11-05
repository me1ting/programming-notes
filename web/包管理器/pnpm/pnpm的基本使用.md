# pnpm的基本使用
## install

### corepack

nodejs自带了一些第三方包管理器，比如pnpm,yarn，需要使用命令启动。

使用管理员权限执行：

```powershell
corepack enable
```

测试：

```powershell
pnpm
```

如果提示`在此系统上禁止运行脚本。`，是Windows默认不允许执行未签名的powshell脚本，需要修改策略。

使用管理员权限执行：

```powershell
set-executionpolicy remotesigned
```
