# 使用os_exec时遇到的ErrDot错误

在使用`os/exec`包时，遇到了`ErrDot`的错误，**相关的命令在使用其它语言时并未遇到类似的错误**，错误消息如下：

```
cannot run executable found relative to current directory
```

翻译为`无法执行相对当前目录找到的可执行文件`。

## 问题的原因

查阅[官方文档](https://pkg.go.dev/os/exec#hdr-Executables_in_the_current_directory)，这个错误是Go在1.20引入的**breaking change**，基于**安全原因**。

未指定目录的可执行文件是基于`PATH`环境变量查找的，一般情况下，我们能执行当前目录下的可执行文件存在两种情况：

- 操作系统**隐式**的在当前目录下查找可执行文件
- 用户显式指定`PATH`包含`.`，如bash下执行`PATH=.:$PATH`

Go开发者认为这两者都是**不安全的**（虽然我个人不太明白后者为啥不安全），因此默认情况下禁止这种行为，用户可以选择手动开启。

## 如何解决？

可以从`代码`和`编译参数`两个维度解决该问题，细节参考文档，这里只做简单介绍。

### 代码角度

比如在使用`exec.Command`时：

```go
cmd := exec.Command("prog")
// 验证存在ErrDot错误，并清空掉
if errors.Is(cmd.Err, exec.ErrDot) {
	cmd.Err = nil
}
if err := cmd.Run(); err != nil {
	log.Fatal(err)
}
```

### 编译参数角度

```powershell
$Env:GODEBUG = "execerrdot=0"
go build
```
