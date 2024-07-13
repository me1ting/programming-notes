# 使用pm2管理nodejs程序

最近接触了nodejs编程，编写了一个简单的express后台服务，但是程序总是无故的down掉。

```
nuhup node dist/index.js &
```

使用网上教程，添加了异常拦截代码：

```js
process.on('uncaughtException', err => {
    console.log('caught uncaught exception: ' + err)
})
```

但是依然无效，查看日志也没有任何输出。

在进一步搜索后，我选择了`pm2`这一款软件，来管理nodejs程序。它可以解决nodejs服务未知原因down掉的问题。

## 安装

按照 [quickstart](https://pm2.keymetrics.io/docs/usage/quick-start/) 进行安装。

## 常用命令

```bash
# 启动服务
pm2 start app.js
# 重启服务，默认会根据文件名称生成app_name
pm2 reload app_name/id
# 关闭服务
pm2 stop app_name/id
```

查看服务：

```bash
pm2 ls
```

日志：

```bash
pm2 logs
pm2 logs --lines 100 # 限制显示行数
pm2 flush appName|appId # 清空特定app的日志
pm2 flush # 清空所有日志
```
