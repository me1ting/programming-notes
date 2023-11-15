# mysql配置文件

>以下`mysql`除非特指，均指`mysql8`
## 概览

mysql大部分配置是通过配置文件来指定的，配置文件本身存在着一些细节，可以从[官方文档：使用配置文件](https://dev.mysql.com/doc/refman/8.2/en/option-files.html)中了解，这里只记录个人感兴趣的细节：

- 配置文件习惯使用`/etc/mysql/my.cnf`
- 配置文件是分组的，服务端使用`[mysqld]`组

本文只关心linux下mysql server的配置选项，所有选项均可以在[官方文档](https://dev.mysql.com/doc/refman/8.0/en/server-option-variable-reference.html)找到。
## 常用配置选项

### user

基于安全原因，mysql应当使用独立的linux mysql账户执行。
`
```
user = mysql
```

### bind-address

设置mysql server监听地址。默认值`*`，表示允许任何网络连接。

如果需要禁止从外网访问mysql server，那么需要修改为`127.0.0.1`。
### mysqlx-bind-address

设置x-plugin的相关监听地址。默认值`*`。

### log_error

指定错误日志文件位置。

默认值为空，将使用数据目录下的`${host_name}.err`文件。

//more

