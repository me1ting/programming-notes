# flag examples
## fullname与shortname

形如下面的命令行使用方式，其中v是shortname,version是fullname：

```
xxx -v
xxx --version
```

在flag中没有直接满足该需求的API，但可以模拟：

```go
var version boolean

func init() {
	const (
		version_usage         = "print version"
	)
	flag.StringVar(&version, "version", false, version_usage)
	flag.StringVar(&version, "v", false, version_usage+" (shorthand)")
}
```

## 参数语法

flag对于以下格式都是支持的：

```
-flag //布尔值
-count=x
-count x
--count=x
--count x
```

## 自定义Usage

flag采取`默认全局单例`的设计模式，可以通过修改全局单例来实现自定义usage：

```go
	f := flag.CommandLine

	f.Usage = func() {
		fmt.Fprintf(f.Output(), "Welcome to trojan-go %s\n", version.VERSION)
		if f.Name() == "" {
			fmt.Fprintf(f.Output(), "Usage:\n")
		} else {
			fmt.Fprintf(f.Output(), "Usage of %s:\n", f.Name())
		}
		fmt.Fprintf(flag.CommandLine.Output(), `options:
-c [ --config ] CONFIG (=config.json) specify config file
-h [ --help ]                         print help message
-l [ --log ] LOG                      specify log file location
-t [ --test ]                         test config file
-v [ --version ]                      print version and build info
`)
```

## 参考资料

[doc: flag](https://pkg.go.dev/flag)