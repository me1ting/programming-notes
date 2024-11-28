# 在nginx上使用letsencrypt

let's encrypt是最常用的免费的https证书，nginx是常用的web服务器之一，本文记录了在nginx上如何使用let's encrypt。

本文所使用的操作系统是ubuntu20.04。

## 安装nginx

略

## 安装certbot

`certbot`是letsencrypt的客户端，它负责验证域名的所属、申请证书等过程。

官方推荐的certbot安装方式是使用`snap`，缺点是会常驻一个守护进程。

因此推荐使用传统安装方式：

```bash
apt update
apt install certbot python3-certbot-nginx
```

## 配置http服务器

我们需要配置web服务的http版本，这里假设我们将配置的web服务是`www.example.com`，创建`/etc/nginx/conf.d/www.example.com.conf`文件：

```
server {
    listen       80;
    server_name  www.example.com;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
}
```

测试配置文件并重启nginx：

```
nginx -t
nginx -s reload
```

保证`http://www.example.com`是可以访问的。

## 启动https服务

使用如下命令为目标web服务添加https：

```
certbot --nginx -d example.com
```

这个命令支持同时为多个web服务添加https：

```
certbot --nginx -d example.com -d www.example.com
```

执行这个命令后，会进入命令行交互，要求你提供必要的信息，设置是否将http重定向https...

## 自动续订

证书的有效期是90天，到期前需要续订，这个步骤应当自动化而非手动操作。

有多种自动化方式，这里使用linux的`cron`功能实现自动续订。

编辑cron的配置文件：

```bash
crontab -e
```

添加以下内容并保存：

```
0 12 * * * /usr/bin/certbot renew --quiet
```

这行配置信息表示每天12点检查证书：30天内过期则续订。

## 参考资料

[# Using Free Let’s Encrypt SSL/TLS Certificates with NGINX](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/)
