# 如何进行端口设置？
对于网络服务端应用，应当按照以下步骤进行端口设置：

- 在应用中应当监听`0.0.0.0`，以及任意端口
- 在`Dockerfile`中将这些端口暴露出来
- 创建容器时，指定端口映射

# 可以将端口映射到`127.0.0.1`下的端口吗？

当前版本的`docker`不支持这样做，但是[docker compose](https://docs.docker.com/compose/compose-file/compose-file-v2/#ports)似乎可以。