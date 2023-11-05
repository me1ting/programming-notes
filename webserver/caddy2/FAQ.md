# cors设置

```
(cors) {
  @cors_preflight method OPTIONS
  @cors header Origin {args.0}

  handle @cors_preflight {
    header Access-Control-Allow-Origin "{args.0}"
    header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE"
    header Access-Control-Allow-Headers "Content-Type"
    header Access-Control-Max-Age "3600"
    respond "" 204
  }

  handle @cors {
    header Access-Control-Allow-Origin "{args.0}"
    header Access-Control-Expose-Headers "Link"
  }
}

example.com {
  import cors https://example.com
  reverse_proxy localhost:8080
}
```

你可以将上述中的`cors`理解成一个函数，你需要根据你的需求将`import cors {site}`加入你的设置中。

如果你想要不受到cors限制，使用`import cors *`，基于安全原因，最好不要在全域中使用。

# SPA设置

SPA使用了前端路由，当使用相同的路径直接访问服务端时，会存在404错误。

服务端需要返回`index.html`，由前端对路径进行处理。

在Caddy中需要使用如下[设置](https://caddyserver.com/docs/caddyfile/patterns#single-page-apps-spas)：

```
example.com {
	root * /path/to/site
	encode gzip
	try_files {path} /index.html
	file_server
}
```