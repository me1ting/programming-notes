# quickstart
## 安装

目前只推荐使用nightly版本，这样也方便及时与社区进行沟通，个人使用可以考虑一周更新一次，除非遇到问题。

### windows

在[下载地址](https://ziglang.org/download/)下载最新版本，并解压，然后使用管理员powershell执行（修改命令中的路径）：

```powershell
[Environment]::SetEnvironmentVariable( "Path", [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\your-path\zig-windows-x86_64-your-version", "Machine" )
```

其它操作系统参考[官方安装说明](https://ziglang.org/learn/getting-started/)

