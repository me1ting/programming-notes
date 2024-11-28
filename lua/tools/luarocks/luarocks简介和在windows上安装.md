# luarocks

`luarocks`是lua社区的实际包管理解决方案。

## windows

在[官网](https://luarocks.github.io/luarocks/releases/) 下载 `luarocks-3.9.2-win32.zip(legacy Windows package, includes Lua 5.1)`。

解压后，执行安装命令：

```bat
./install.bat /P D:\AppsInDisk\LuaRocks/3.9.2 /TREE D:\AppsInDisk\LuaRocks\systree /L
```

这表示将Luarocks安装到`D:\AppsInDisk\LuaRocks/3.9.2`，将库文件存储在`D:\AppsInDisk\LuaRocks\systree`，Luarocks自己维护一份Lua5.1。

命令的细节参考[文档说明](https://github.com/luarocks/luarocks/wiki/Installation-instructions-for-Windows)。

为了避免污染环境变量或者设置环境变量的麻烦，通过以下方式临时设置环境变量：

```powershell
$env:PATH += ";D:\AppsInDisk\LuaRocks/3.9.2"
$env:LUA_PATH += ";D:\AppsInDisk\LuaRocks/3.9.2\lua\?.lua;D:\AppsInDisk\LuaRocks/3.9.2\lua\?\init.lua"
# 用户安装的库
$env:PATH += ";%APPDATA%\LuaRocks\bin"
$env:LUA_PATH += ";%APPDATA%\LuaRocks\share\lua\5.1\?.lua;%APPDATA%\LuaRocks\share\lua\5.1\?\init.lua"
$env:LUA_CPATH += ";%APPDATA%\LuaRocks\lib\lua\5.1\?.dll"
# 全局安装的库
$env:PATH += ";D:\AppsInDisk\LuaRocks\systree\bin"
$env:LUA_PATH += ";D:\AppsInDisk\LuaRocks\systree\share\lua\5.1\?.lua;D:\AppsInDisk\LuaRocks\systree\share\lua\5.1\?\init.lua"
$env:LUA_CPATH += ";D:\AppsInDisk\LuaRocks\systree\lib\lua\5.1\?.dll"
```

```sh
export PATH="$PATH:D:\AppsInDisk\LuaRocks/3.9.2"
export LUA_PATH="$LUA_PATH:D:\AppsInDisk\LuaRocks/3.9.2\lua\?.lua:D:\AppsInDisk\LuaRocks/3.9.2\lua\?\init.lua"
```
