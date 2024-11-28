
# 使用docker运行postgresql

## 拉取镜像

### 镜像选择

postgresql采用LTS发行，选择合适的版本。

postgresql当前提供了3种基础镜像：

- bookworm，debian12
- bullseye，debian11
- alpine

这里我们使用默认的最新stable版本：

```
docker pull postgres
```

## 启动命令

以下命令先别直接使用，先跳到SSL配置部分，阅读完成后再执行该命令。

```sh
sudo mkdir -p /usr/local/docker/pg/data

docker run \
  -id --name postgres \
  -v /usr/local/docker/pg:/var/lib/postgresql \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=123456 \
  -e LANG=C.UTF-8 \
  -d postgres \
  -c ssl=on \
  -c ssl_cert_file=/var/lib/postgresql/server.cer \
  -c ssl_key_file=/var/lib/postgresql/server.key
```

以下是细节说明。
### 卷映射

我们创建了pg所需的数据存储路径`/usr/local/docker/pg/data`：

```sh
sudo mkdir -p /usr/local/docker/pg/data
```

但我们映射的却是`/usr/local/docker/pg`到`/var/lib/postgresql`，是因为我们还要在该路径下存储SSL所需的server的证书和私钥。

>SSL其实是旧术语，当前应当为TLS，但为了保持兼容性，postgresql的相关文档还是用SSL来说明，因此本文也采用这个习惯。

### SSL支持

默认情况下postgresql未开启SSL支持，postgresql不强制使用SSL，启用SSL时你可以选择使用SSL或者不使用SSL。

对于数据库连接，大多数情况下使用自签名服务端证书，而且server和client通常是相同的使用者。为了避免中间人攻击，client需要指定CA证书来验证server证书。

可以使用OPENSSL来生成CA证书和server证书，这里推荐使用Azure的[证书生成网站](https://appgwbackendcertgenerator.azurewebsites.net/)。

![](_images/Pasted%20image%2020240720091432.png)

使用sftp工具将`server.cer`和`server.key`上传到`/usr/local/docker/pg`，并根据要求修改权限：

```sh
chmod 0600 server.key
```

#### client端设置

以Navicat为例，我们需要启用SSL，验证CA，并指定CA证书：

![](_images/Pasted%20image%2020240720091908.png)

### 其它说明

语言指定，不知道具体效果：

```
-e LANG=C.UTF-8
```

指定默认账户(postgres)的密码，需要修改为安全的密码：

```
-e POSTGRES_PASSWORD=123456
```
## 参考资料

[doc: postgresql docker readme](https://github.com/docker-library/docs/blob/master/postgres/README.md)<br/>
[doc: SSL连接](https://www.postgresql.org/docs/16/ssl-tcp.html)<br/>
[blog: Docker安装部署PostgreSQL数据库](https://juejin.cn/post/7239990044333801533)<br/>
[azure: 使用自定义根 CA 生成 Azure 应用程序网关自签名证书](https://learn.microsoft.com/zh-cn/azure/application-gateway/self-signed-certificates)<br/>