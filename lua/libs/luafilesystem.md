# luafilesystem

## 编译

### windows

#### 使用Luarocks安装失败

尝试使用`luarocks`来安装：

```
>luarocks install luafilesystem
'mingw32-gcc' 不是内部或外部命令，也不是可运行的程序或批处理文件。
```

没找到`mingw32-gcc`，去MinGW64网站上看，选项还挺多的：

- LLVM-MinGW，LLVM在MinGW属于小众，大多数都是要求GCC
- w64devkit，不了解
- MingW-W64-builds，以前用过，还不错
- MSYS2，还带包管理器，个人认为有点重
- winlibs，类似MingW-W64-builds

因为之前用过，所有这里选择的是MingW-W64-builds。进入下载页面，又到了选择的时刻：

```
i686-13.2.0-release-mcf-dwarf-ucrt-rt_v11-rev1.7z
i686-13.2.0-release-posix-dwarf-msvcrt-rt_v11-rev1.7z
i686-13.2.0-release-posix-dwarf-ucrt-rt_v11-rev1.7z
i686-13.2.0-release-win32-dwarf-msvcrt-rt_v11-rev1.7z
i686-13.2.0-release-win32-dwarf-ucrt-rt_v11-rev1.7z
x86_64-13.2.0-release-mcf-seh-ucrt-rt_v11-rev1.7z
x86_64-13.2.0-release-posix-seh-msvcrt-rt_v11-rev1.7z
x86_64-13.2.0-release-posix-seh-ucrt-rt_v11-rev1.7z
x86_64-13.2.0-release-win32-seh-msvcrt-rt_v11-rev1.7z
x86_64-13.2.0-release-win32-seh-ucrt-rt_v11-rev1.7z
```

这里进行说明：

- i686,x86_64，一般选x86_64，两者应当都可以交叉编译
- `mcf`,`posix`,`win32`，线程模型，一般选posix，mcf是新出的，win32不太合适
- `seh`,`dwarf`，之前还有个`sjlj`似乎被淘汰了，异常模型，这里没什么[好选的](https://github.com/brechtsanders/winlibs_mingw/issues/20)，取决于你选择的架构
- `msvcrt`,`ucrt`，C运行时，后者只支持Win10，一般选`msvcrt`，除非追求极致性能

这里我下载了`x86_64-13.2.0-release-posix-seh-msvcrt-rt_v11-rev1.7z`。

解压后用Everything搜索`mingw32-gcc`，只找到了一个`x86_64-w64-mingw32-gcc.exe`，这里我直接重命名`mingw32-gcc.exe`（你也可以选择复制再重命名）。

添加PATH，继续编译：

```
>$env:PATH += ";D:\AppsInDisk\x86_64-13.2.0-release-posix-seh-msvcrt-rt_v11-rev1\mingw64\bin"
>luarocks install luafilesystem
Installing https://luarocks.org/luafilesystem-1.8.0-1.src.rock

luafilesystem 1.8.0-1 depends on lua >= 5.1 (5.1-1 provided by VM)
mingw32-gcc -O2 -c -o src/lfs.o -ID:\AppsInDisk\LuaRocks/3.9.2\include src/lfs.c
mingw32-gcc  -shared -o lfs.dll src/lfs.o D:\AppsInDisk\LuaRocks/3.9.2/lua5.1.lib -lMSVCR80
D:/AppsInDisk/x86_64-13.2.0-release-posix-seh-msvcrt-rt_v11-rev1/mingw64/bin/../lib/gcc/x86_64-w64-mingw32/13.2.0/../../../../x86_64-w64-mingw32/bin/ld.exe: src/lfs.o:lfs.c:(.text+0x26e): undefined reference to `lua_pushnil'
...
```

报错，未定义的引用。

虽然对C系列不太熟悉，但可以猜测是构建环境不一致导致的，当前的Lua是MSVC构建的，而`luarocks`是用MinGW构建的，因此无法链接。

#### 手动构建

由于这个库本身并不复杂，因此我没有选择修改LuaRocks的Lua版本，而是手动链接。

我们需要一个使用MinGW构建的Lua，有两种方案，lua或luajit。

使用MinGW构建lua并没有任何官方讲解，个人基于Google找到了一个可行的方案[luawinmake](https://github.com/Tieske/luawinmake)。

luajit则是官方提供了编译步骤。

当我们有了一个可用的MinGW构建的Lua，那么就可用使用如下命名手动构建：

```
>cd luafilesystem
>mingw32-gcc -O2 -c -o src/lfs.o src/lfs.c
>mingw32-gcc  -shared -o lfs.dll src/lfs.o D:\AppsInDisk\luajit2.1_mingw32\lua51.dll
```

实际测试，使用MSVC x64构建的luajit中的lua51.dll也可以用来链接，但这其中原理不是我能弄清楚的。