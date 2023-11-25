# 在docker上使用mysql

## 拉取镜像

```
docker pull mysql:8.0.35
```

### 镜像选择

选择镜像时考虑两个方面：

- mysql版本
- 基础镜像

#### mysql版本选择

mysql采用的是[语义化版本2.0](https://semver.org/lang/zh-CN/)

目前mysql存在两个大版本：

- mysql5，已结束开发，处于维护阶段
- mysql8，持续开发版本

mysql8在2023年引入了[长期服务版本和创新版本](https://dev.mysql.com/blog-archive/introducing-mysql-innovation-and-long-term-support-lts-versions/)，其中：

- 8.0是**事实**上的LTS版本（但是官方并未称呼其为LTS版本）
- 8.1是官方宣布的第一个创新版本

对于普通项目，使用LTS版本足以满足需求，注意使用最新修订版本。

### 基础镜像选择

在官方MySQL镜像中[过滤](https://hub.docker.com/_/mysql/tags?page=1&ordering=last_updated&name=8.0.35)`8.0.35`版本，目前有3种：

- default(目前实际使用的是oracle)
- oracle
- debian

一般情况，MySQL镜像只用来跑mysql，因此实际选哪一种都可以，比如default。

## 准备账户、目录、配置文件

这里，我们使用`mysql`账号和`mysql`组来执行mysql容器。

```sh
# 创建mysql组
sudo groupadd mysql
# 创建mysql用户，-M表示不生成home目录
sudo useradd mysql -g mysql -M -s /bin/bash
```

我们将镜像使用的配置目录、日志目录、数据目录挂载到host主机的目录中，这里先生成挂载点：

```sh
sudo mkdir -p /usr/local/docker/mysql/conf
sudo touch /usr/local/docker/mysql/my.cnf
sudo mkdir -p /usr/local/docker/mysql/conf/conf.d
sudo mkdir -p /usr/local/docker/mysql/logs
sudo mkdir -p /usr/local/docker/mysql/data
sudo chown -R mysql.mysql /usr/local/docker/mysql/
```

修改`/usr/local/docker/mysql/my.cnf`，这里使用最简单的配置文件，根据实际需求修改：

```
[mysqld]
log_error = /var/log/mysql/error.log
```

## 启动mysql

```
# 1002:1002是mysql用户的uid:gid
# --net=host表示直接使用host的网络
sudo docker run --user 1002:1002 --net=host --name mysql \
-v /usr/local/docker/mysql/conf:/etc/mysql \
-v /usr/local/docker/mysql/logs:/var/log/mysql \
-v /usr/local/docker/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=root123 \
-d mysql:8.0.35
```

使用`ps -ef|grep mysqld`，检查启动是否成功。

## 开启远程登录

```
# 进入镜像的bash环境
sudo docker exec -it mysql bash
# 执行mysql客户端，root账户名是我们在-e MYSQL_ROOT_PASSWORD=root123 \中指定的
mysql -uroot -proot123
```

执行以下SQL命令：

```sql
-- 用户名为root，密码为root123，要求使用安全连接，注意修改密码为更安全的密码
CREATE USER 'root'@'%' IDENTIFIED BY 'root123' REQUIRE SSL;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
quit
```