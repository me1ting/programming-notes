# 使用ssh访问仓库

## 生成非对称密钥对

使用[ssh-keygen](https://docs.gitlab.com/ee/user/ssh.html#generate-an-ssh-key-pair)命令行工具来生成密钥对。

```
ssh-keygen -t ed25519 -C "gitlab"
```

默认生成两个文件：

- id_ed25519 私钥
- id_ed25519.pub 公钥
## 密钥对的存储位置和命名

默认情况下，ssh的密钥对存储在`~/.ssh/`目录下，使用[默认名称](https://docs.gitlab.com/ee/user/ssh.html#see-if-you-have-an-existing-ssh-key-pair)。

修改存储路径需要[额外配置](https://docs.gitlab.com/ee/user/ssh.html#configure-ssh-to-point-to-a-different-directory)，修改名称同理。

## 在gitlab.com设置公钥

在 偏好设置--SSH密钥 中，添加我们刚才生成的公钥。

## 第一次使用

可以使用如下命令来测试ssh：

```
ssh -T git@gitlab.com
```

第一次使用会提示如下内容：

```
The authenticity of host 'gitlab.example.com (35.231.145.151)' can't be established.
ECDSA key fingerprint is SHA256:HbW3g8zUjNSksFbqTiUWPWg2Bq1x8xdGUrliXFzSnUw.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'gitlab.example.com' (ECDSA) to the list of known hosts.
```

由于显示BUG，我这里弹出一个框，只显示了：

```
The authenticity of host 'gitlab.example.com (35.231.145.151)' can't be established.
ECDSA key fingerprint is SHA256:HbW3g8zUjNSksFbqTiUWPWg2Bq1x8xdGUrliXFzSnUw.
```

这让我疑惑了一段时间，查看文档才发现是要求你输入`yes`或`no`，输入yes然后点击`enter`。

