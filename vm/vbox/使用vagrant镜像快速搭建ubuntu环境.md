# 使用ubuntu vagrant-img

vagrant是一款虚拟化解决方案，主要目标是简化**开发阶段**的虚拟系统使用，这是它与docker最大的不同。

但是个人在尝试使用vagrant软件时体验并不理想：

- 使用ruby编写，需要ruby运行时，因此安装文件较大。
- 在windows平台上bug较多，软件的可用性并不高。

但用vagrant-img来快速搭建ubuntu环境却很方便。
# 下载

以[bionic/current/bionic-server-cloudimg-amd64-vagrant.box](http://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64-vagrant.box)为例：

下载文件大小仅330M，比下载安装镜像文件小了许多。

![](_v_images/20201011140144457_11969.png)

解压该文件：

![](20201011140213583_18927.png)

# 导入

使用vbox导入功能导入该镜像：

![](20201011140317284_31726.png)

# 虚拟机硬件设置

设置vbox网络，vbox-管理-主机网络管理器，确保存在一个HOST-ONLY网卡：

![](20201011140542353_4169.png)

这里我们将使用第二个网卡，修改IP地址，以及DHCP服务器地址为如上的域。

打开导入的虚拟机设置，根据提示修改显卡：

![](20201011140716207_30053.png)

网卡一选择NAT

![](20201011140738469_15354.png)

网卡二设置为我们刚才设置的HOSTONLY网卡：

![](20201011140819325_12587.png)
# 虚拟机软件设置

开启虚拟机，用户名和密码为为`vagrant`,`vagrant`

## 网卡配置

进入`/etc/netplan`，创建网络配置文件：

`sudo vim enp8s8.yaml`

其内容为（根据需要进行修改，建议使用固定IP）：

```
---
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s8:
      addresses:
      - 192.168.162.163/24
```

重启系统：

```
sudo reboot
```

## sshd配置

修改sshd配置文件：

```
sudo vim /etc/ssh/sshd_config
```

修改以下字段：

```
PasswordAuthentication yes
```

重启ssh服务：

```
sudo service sshd restart
```

# 总结

感谢vagrant，让我们可以使用轻量的虚拟机镜像。

相比下载安装镜像并进行安装，这种方式省时省力，而且镜像本身更加精简。
