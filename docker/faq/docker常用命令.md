# docker 常用命令

## 资源占用

查看container的运行资源：

```
docker stats
```

查看镜像：

```
docker images
```

## 日志

查看容器日志：

```
docker logs container_id
```

## 容器交互

进入容器的bash环境：

```
docker exec -it [container-id|container-name] bash
```

## 容器

查看运行中的容器：

```
docker ps
```

查看所有容器：

```
docker ps -a
```
