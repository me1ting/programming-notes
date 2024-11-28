# 使用云镜像快速搭建ubuntu server环境

使用ubuntu提供的云镜像文件，我们可以快速搭建一个可用的ubuntu环境，而不需要使用live-cd一步步安装。

## 下载镜像

在[下载站点](https://cloud-images.ubuntu.com/)找到我们需要的镜像文件，比如`https://cloud-images.ubuntu.com/jammy/current/`表示`ubuntu22.04`的最新构建版本，搜索并下载`.ova`镜像。

![](_images/Pasted%20image%2020231112161057.png)

## 导入镜像

双击该镜像文件，vbox会识别到该文件。

![](_images/Pasted%20image%2020231112161921.png)

根据自己的需要进行修改，建议：

- 取消软驱和光驱
- 修改存储位置

点击完成，等待导入执行完成。

## 硬件设置

选择导入的虚拟机，右键设置。

### 声音设置

取消勾选声音。

### 网络设置

首先，需要确保vbox已经设置了一个Host-Only网络。在`管理->工具->网络管理器`中确保已经存在一个Host-Only网络，如果没有，那么添加一个，如果手动配置了IP地址，请同时修改DHCP服务器的网段。

![](_images/Pasted%20image%2020231112183725.png)

将网卡1设置为NAT模式，然后给虚拟机添加一个host-only网络。

![](_images/Pasted%20image%2020231112170606.png)

### 显示设置

![](_images/Pasted%20image%2020231112170728.png)

根据提示，选择推荐的VMSVGA显卡。

## 软件设置

### 账户设置

镜像只有一个root用户，而且没有设置密码。

一般情况下，镜像是通过某些自动化方式来初始化的（未研究）。如果只是个人使用，可以通过手动来实现：

- 在启动时按住shift键，进入grub启动项界面
- 选择`Advanced`，选择恢复模式(recovery mode),选择`root`菜单项
- 使用`passwd root`给root账户添加密码，或者使用命令添加账户

### 网络设置

镜像没有添加网络，需要使用者自行添加。

使用`ip a`查看网卡，存在3个网卡：

- lo，本地回环
- enpxxx，比如enp0s3
- enpyyy，比如enp0s8

对比虚拟机的mac地址，可以确认enp0s3和enp0s8分别属于NAT网络还是HOST-ONLY网络。这里假设`enp0s3`是NAT网络。

在`/etc/netplan`创建`enp0s3.yaml`（命名随意，个人喜好用网卡命名）：

```yaml
network:
  ethernets:
    enp0s3:
      dhcp4: true
```

创建`enp0s3.yaml`:

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s8:
      addresses:
        - 192.168.162.164/24
```

这里使用了固定的ip地址`192.168.162.164/24`来方便使用`ssh`，你也可以选择使用dhcp。

使用命令`netplan apply`使得上述网络设置立即生效。

### ssh设置

#### 设置ssh密钥

使用`ps -ef|grep ssh`，我们会发现sshd服务并没有启动。

重启`service sshd restart`，会提示启动失败。根据提示，查看日志，会显示如下错误：

```
Failed to start OpenBSD Secure Shell server
```

使用`/usr/sbin/sshd -ddd`命令进行debug，会提示如下错误：

```
could not load host key: /etc/ssh/ssh_host_rsa_key
```

解决办法是生成ssh密钥：

```
/usr/bin/ssh-keygen -A
```

### 设置密码登录

默认配置文件不允许通过密码认证，同时不允许root账户使用ssh访问。

修改`/etc/ssh/sshd_config`，修改以下字段的值：

```
PasswordAuthentication yes
# 如果你希望使用root账户使用密码登录
PermitRootLogin yes
```

重启sshd服务：`service sshd restart`。

## 总结

本文讲解了如何使用ubuntu官方云镜像在vbox上搭建供个人开发者使用的ubuntu server环境。

由于此类镜像并非面向普通开发人员使用，因此还需要手动进行设置，相比使用vagrant镜像麻烦了一些。
