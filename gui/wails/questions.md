# questions

## 热重载出现 undefined错误

当使用react router时，每次热重载会出现以下错误：

```
Cannot read properties of undefined (reading 'main')
```

参考该[issue](https://github.com/wailsapp/wails/issues/2262)，通过手动注入依赖可以解决问题，参考[官方文档](https://wails.io/docs/guides/frontend/#script-injection)：

```jsx
<html>
  <head>
    <title>injection example</title>
    <meta name="wails-options" content="noautoinject" /><!--添加这行，关闭自动注入-->
    <link rel="stylesheet" href="/main.css" />
  </head>

  <body data-wails-drag>
    <div class="logo"></div>
    <div class="result" id="result">Please enter your name below 👇</div>
    <div class="input-box" id="input" data-wails-no-drag>
      <input class="input" id="name" type="text" autocomplete="off" />
      <button class="btn" onclick="greet()">Greet</button>
    </div>

	<!--添加后续这2行，实现手动注入-->
    <script src="/wails/ipc.js"></script>
    <script src="/wails/runtime.js"></script>
  </body>
</html>
```

## 为什么js无法调用runtime提供的函数

重启`wails dev`试试。

## 报毒

Go写的程序现在报毒率有所增加，解决办法：

- 使用wails默认的Go版本，避免使用高版本带来更多的误报率
- 使用证书签名（收费）
