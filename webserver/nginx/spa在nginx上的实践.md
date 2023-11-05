# SPA在Nginx上的实践

SPA是单页应用的缩写，是目前前端应用的一种常见实现方式。

## 支持前端路由

### 什么是前端路由？

一个典型的SPA应用，其web文件如下：

```
index.html
assets/
example/
...
```

我们访问该应用时，服务端响应`index.html`。假设这个应用有`config`页面，浏览器会显示`example.com/config`地址，但服务端实际没有该页面对应的html文件，浏览器也没有访问`example.com/config`，而是由前端通过javascript对浏览器的url进行了修改。

如果没有做任何处理，我们直接访问`example.com/config`地址，服务端会响应404错误。直接访问是很常见的场景：书签、刷新...

为了避免这种情况，服务端需要响应index.html，SPA框架会根据url自动切换页面。

>这里可以看到，前端路由的功能至少包括两部分：
>1.根据用户的操作，显示页面并修改URL
>2.根据URL切换页面

### 如何让nginx支持前端路由？

在nginx中，我们需要使用[try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)指令：

```
try_files file ... uri;
```

try_files指令会依次尝试可能的文件，如果都不存在，那么内部重定向到最后一个参数指向的文件。

一个典型的SPA应用的配置如下：

```
location / {
    root /code/app1/build;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}
```

依次尝试`uri`对应的文件，`uri`对应的目录，如果最后都不存在，返回`index.html`。