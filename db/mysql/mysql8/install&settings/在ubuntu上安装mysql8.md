# 在ubuntu上安装mysql

本文记录了在ubuntu 20.04上安装mysql8的步骤。

## 安装

按照[官方文档](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/#apt-repo-fresh-install)说明的步骤进行安装。

流程包括：

- 下载一个deb包并进行安装，其包含了mysql 8.0相关的源
- 使用`apt`进行安装

命令如下：

```bash
# 最新链接在文档上找
wget https://dev.mysql.com/get/mysql-apt-config_0.8.24-1_all.deb
# 会出现GUI提供修改需要安装的源，选择默认
sudo dpkg -i mysql-apt-config_0.8.24-1_all.deb
sudo apt update
# 这一步会要求提供一个mysql的root账户密码
sudo apt install mysql-server
```

## 基本命令

使用`systemctl`来对mysql server进行管理，支持`stop`,`start`,`status`,`restart`等命令，如：

```bash
# 重启服务
sudo systemctl restart mysql
```

## 其他配置

基于安全考虑，mysql默认只支持在`local`上使用`local`账户访问。但是在安全性要求不是很高的场景，我们可能需要远程访问。

这需要配置以下步骤。

### 允许远程访问

首先，需要开启远程访问功能。

修改`/etc/mysql/mysql.conf.d/mysqld.cnf`文件，在`mysqld`配置项中添加：

```
bind-address    = 0.0.0.0
```

>`0.0.0.0`表示绑定所有网卡，根据需求，你可以绑定公网IP或者内网IP或者localhost。

### 创建远程账户

根据不同的需求，来创建需要的远程账户。下面示例创建了一个远程`root`账户，具有所有权限。

在安装`mysql`的主机上使用`mysql`命令行工具（由于该工具使用了TCP，需要先进行`bind-address`的配置）：

```bash
# 这里需要的密码是安装mysql时设置的密码
mysql -u root -p
```

执行以下指令：

```sql
-- 用户名为root，密码为root123，要求使用安全连接，注意修改密码为更安全的密码
CREATE USER 'root'@'%' IDENTIFIED BY 'root123' REQUIRE SSL;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
quit
```

注意，除非你明确知道上述命令的作用，否则不要在生产环境执行上述操作，最好根据实际需求来进行配置。
