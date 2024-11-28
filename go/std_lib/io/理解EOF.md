# 理解EOF

## io.EOF

io包定义了`io.EOF`错误，表示`Read()`操作时没有了更多的数据。`EOF`是`end of file`的缩写，那么具体的EOF发生场景是什么呢？

以下3种场景会出现`EOF`：

- 文件读到末尾，没有更多的数据
- 网络IO关闭，数据读取完毕
- 命令行下使用特定键盘输入，表示标准输入到达末尾

# 模拟网络的EOF

在网络IO中，EOF表示已经到达网络流的结尾了，而其结尾就是连接被关闭。

因此，**等待读取发送端发送更多的数据，或者缓冲区的内容为空时，并不会收到EOF**。

可以使用一个代码来测试：

client发送一段数据，然后暂停10s，再关闭。

```go
func main() {
	data := []byte("abcdefghijk")
	conn, _ := net.DialTimeout("tcp", "localhost:4044", time.Second*30)

	_, _ = conn.Write(data)

	fmt.Println("running...")
	time.Sleep(time.Second*10)
	conn.Close()
}
```

server不断尝试接收数据，并打印情况：

```go
func main() {
	l, _ := net.Listen("tcp", ":4044")
	fmt.Println("listen to 4044")
	for {
		conn, _ := l.Accept()
		go handleConn(conn)
	}
}

func handleConn(conn net.Conn) {
	defer conn.Close()
	var buf [1024]byte
	for {
		n, err := conn.Read(buf[0:])
		if err != nil {
			if err == io.EOF {
				fmt.Println("eof")
				continue
			}
		} else {
			fmt.Println("recv:", string(buf[:n]))
		}
	}
}
```

测试结果显示，server只有在client退出后才开始打印eof。
