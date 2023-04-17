# 如何设置`LUA_PATH`,`LUA_CPATH`
`LUA_PATH`是lua的库查找路径，`LUA_CPATH`是lua的C语言实现的库的查找路径。

`LUA_PATH`与`LUA_CPATH`使用自己的语法风格，需要注意，这里提供一个示例：
```bash
export LUA_PATH="/app/runtime/lua/?.lua;/app/runtime/lua/?/init.lua;;"
```

如果不太清楚，可以在交互解释器下执行以下命令，查看对应的环境变量：
```lua
print(package.path)
print(package.cpath)
```

更多细节参考该连接：[how to set the LUA_PATH and LUA_CPATH](https://stackoverflow.com/questions/26446333/how-to-set-the-lua-path-and-lua-cpath-for-the-zerobrane-studio-in-linux)