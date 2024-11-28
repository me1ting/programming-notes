# Linux磁盘空间不足的分析和解决

## 案例

在Linux安装Rust，提示：

```
error: component download failed for rust-std-x86_64-unknown-linux-gnu: unable to write download to disk
```

显示无法写入文件，因此我怀疑磁盘的问题，最可能的问题是磁盘满了，使用`df -h`查看磁盘占用情况：

```
root@iZwz9h16122tvtmdfbntusZ:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            844M     0  844M   0% /dev
tmpfs           173M  604K  172M   1% /run
/dev/vda3        40G   39G     0 100% /
tmpfs           863M     0  863M   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
/dev/vda2       189M   12M  177M   7% /boot/efi
tmpfs            50M     0   50M   0% /usr/local/aegis/cgroup
tmpfs           173M     0  173M   0% /run/user/0
```

这是阿里云的40G小鸡，已经被写满。

那么，这个空间占用是否正常呢，对比同样一台使用情况的阿里云的服务器：

```
root@iZj6c3oxgp49yogpao2y9qZ:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            836M     0  836M   0% /dev
tmpfs           171M  604K  171M   1% /run
/dev/vda1        59G  3.6G   53G   7% /
tmpfs           854M     0  854M   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
overlay          59G  3.6G   53G   7% /var/lib/docker/overlay2/37c8aa0a42a723c05ec66d0f97fab9dd177e6cfbdc7329f5b1708c238cac7ada/merged
tmpfs           171M     0  171M   0% /run/user/0
```

可以看到这种情况是非常不正常的。

有了参照物，因此我们可以对比检查是什么原因导致磁盘使用不正常。使用命令`du -h --max-depth=1`逐层检查目录树中异常的磁盘占用。

```
root@iZwz9h16122tvtmdfbntusZ:/# du -h --max-depth=1
1.8M    ./tmp
0       ./dev
4.0K    ./mnt
3.1G    ./usr
8.0K    ./media
16K     ./lost+found
4.0K    ./srv
du: cannot access './proc/600205/task/600205/fd/4': No such file or directory
du: cannot access './proc/600205/task/600205/fdinfo/4': No such file or directory
du: cannot access './proc/600205/fd/3': No such file or directory
du: cannot access './proc/600205/fdinfo/3': No such file or directory
0       ./proc
524M    ./var
4.5M    ./etc
0       ./sys
148M    ./boot
4.0K    ./opt
604K    ./run
4.0K    ./home
36G     ./root
39G     .
```

这里可以看到`./root`存在异常的磁盘占用。最后检查发现是一个`nohup.out`文件的异常占用：

```
-rw-------  1 root root 37205671936 Sep 17 18:42 nohup.out
```

这是一个web服务，可能被攻击了，或者程序出错。

## 参考资料

[csdn: 解决Linux磁盘空间不足的办法](https://blog.csdn.net/qq_41394352/article/details/114532304)
