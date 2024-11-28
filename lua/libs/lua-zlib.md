# lua-zlib

## 编译

### windows

#### 尝试使用luarocks

和`luafilesystem`一样，我们先拿`luarocks`看看效果。

```
>luarocks install lua-zlib
Error: Could not find header file for ZLIB
  No file zlib.h in c:/external/include
  No file zlib.h in c:/mingw/include
  No file zlib.h in c:/windows/system32/include
You may have to install ZLIB in your system and/or pass ZLIB_DIR or ZLIB_INCDIR to the luarocks command.
Example: luarocks install lua-zlib ZLIB_DIR=/usr/local
```

找不到`zlib`，去[github](https://github.com/madler/zlib)下载一份。

#### 编译zlib

下载源码后，进入主目录，根据`win32`目录下的文档说明，使用以下命令编译：

```powershell
>mingw32-make -f win32/Makefile.gcc
```

#### 继续尝试

```powershell
>luarocks install lua-zlib ZLIB_INCDIR=E:\poblibs\zlib-develop
mingw32-gcc -O2 -c -o lua_zlib.o -IE:\poblibs\lua-5.1.5\src lua_zlib.c -DLZLIB_COMPAT -IE:\poblibs\zlib-develop
mingw32-gcc -shared -o zlib.dll lua_zlib.o -lc:/external/zlib E:\poblibs\lua-5.1.5\src/lua51.dll -lMSVCR80

D:/.../ld.exe: cannot find -lc:/external/zlib: Invalid argument
collect2.exe: error: ld returned 1 exit status
```

失败，那就手动编译。

#### 手动编译

从github上下载一份lua-zlib源码，然后修改luarocks的编译命令进行编译：

```
>cd E:\poblibs\lua-zlib-master
>mingw32-gcc -O2 -c -o lua_zlib.o -IE:\poblibs\lua-5.1.5\src lua_zlib.c -DLZLIB_COMPAT -IE:\poblibs\zlib-develop
>mingw32-gcc -shared -o zlib.dll lua_zlib.o E:\poblibs\zlib-develop\zlib1.dll E:\poblibs\lua-5.1.5\src/lua51.dll -lMSVCR80
```

编译得到`zlib.dll`，丢到项目的`LUA_CPATH`，同时复制一份`zlib1.dll`到项目的工作目录。
