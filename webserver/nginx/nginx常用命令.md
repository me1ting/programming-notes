# nginx常用命令

## 生命周期

通过`nginx -s command`向nginx发送生命周期信号，包括：

```
# 重启服务
nginx -s reload
# 关闭服务
nginx -s stop
```

