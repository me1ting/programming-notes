# 绑定Title

在一些场景下，我们要求脚本只有在特定窗口中才能执行，ahk是通过窗口的标题来实现的。

## 如何获取窗口的Title？

使用 PowerShell命令：

```powershell
Get-Process |where {$_.mainWindowTItle} |format-table id,name,mainwindowtitle
```

我们会得到如下的列表，从而判断目标Title：

```
   Id Name          MainWindowTitle
   -- ----          ---------------
 7760 notepad++     *新文件 4 - Notepad++
 2424 Obsidian      如何获取窗口的title？ - programming-notes - Obsidian v1.6.5
10932 powershell    Windows PowerShell
 8728 Taskmgr       任务管理器
 3376 TextInputHost Microsoft Text Input Application
```
