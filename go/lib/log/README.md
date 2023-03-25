# 简介
Go目前的日志框架有：

- 官方自带log，特点是轻量
- [logrus](https://github.com/sirupsen/logrus) Go日志的开拓者，特点是结构化
- [zap](https://github.com/uber-go/zap) uber出品，特点是高效结构化
- [zerolog](https://github.com/rs/zerolog)

# 自带log
自带log使用默认格式`time message`：
```
2021/01/02 09:53:09 [http] 127.0.0.1:56339 <-> github.com:443
```
仅（隐式）支持`info`,`fatal`两种日志记录级别。

因此自带log通常不能满足应用开发需求，特别是企业应用的开发。

# 其它log
## 什么是结构化日志？
日志通常有两个目的：

- 控制台输出，这是命令行工具的需求，要求human-friendly
- 文本、数据库记录，这是企业级软件的需求，要求数据结构化

`结构化日志`是日志框架的一个重要特性，适用于后一种需求，一般以JSON的格式存储数据。

传统上使用日志时很容易这样使用：
代码：
```go
log.Printf("[http] %s -> %s: %s\n", conn.RemoteAddr(), conn.LocalAddr(), err)
```
输出：
```
2021/01/02 13:00:37 [http] 127.0.0.1:62796 >-< registry.npmjs.org:443
```

这样的方式存在明显的缺点：

- 使用format，效率低下
- 信息中的关键信息难以提取，以供企业的日志分析框架使用

而结构化日志中我们可以这样使用：
代码：
```go
  log.WithFields(log.Fields{
    "mod": "http",
    "from": conn.RemoteAddr(),
    "to": conn.LocalAddr()
    "error": err
  }).Info("connection error")
```
输出类似如下（取决于格式）：
```
{"level":"info","time":1494567715,"foo":"bar","dict":{"bar":"baz","n":1},"message":"hello world"}
```

这样将信息和数据分离，便于日志分析。