# golang jwt的基本使用

本文介绍golang jwt库在gin中的基本使用。

## 使用模型

在账户`登陆`操作成功后，服务器生成jwt数据并返回给客户端。

客户端将jwt数据存储在本地，并在请求时携带jwt数据，服务端通过gin中间件
