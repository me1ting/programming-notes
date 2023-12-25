# examples

## 重定向

使用server级别的rewrite指令：

```
server {
  listen 443 ssl;
  server_name old.domain.com;
  # ...

  rewrite ^/(.*)$ https://new.domain.com/$1;
}
```

默认情况下为302重定向（暂时重定向），301重定向需要添加额外标志`permanent`：

```
rewrite ^/(.*)$ https://new.domain.com/$1 permanent;
```