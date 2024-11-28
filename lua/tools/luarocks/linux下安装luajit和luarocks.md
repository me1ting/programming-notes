# linux下安装luajit和luarocks

安装依赖：

```
sudo apt update
sudo apt install build-essential libreadline-dev unzip
```

从luajit[官方镜像](https://github.com/LuaJIT/LuaJIT)处下载源码（随你用git还是zip），然后make和install：

```
cd LuaJIT-2.1
sudo make
sudo make install
```

同样，安装luarocks，从[下载地址](https://luarocks.github.io/luarocks/releases/)下载luarocks源码

```
tar -zxf luarocks-3.9.2.tar.gz
cd luarocks-3.9.2
./configure --with-lua-include=/usr/local/include
export LUA_INCDIR=/usr/local/include/luajit-2.1
sudo make
sudo make install
sudo luarocks config variables.LUA_INCDIR /usr/local/include/luajit-2.1
```
