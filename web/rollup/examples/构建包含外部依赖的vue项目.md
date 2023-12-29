# 构建包含外部依赖的vue项目

个人项目的部分依赖因为文件较大，因此选择使用CDN分发，而非构建到Vue项目的构建结果中。

```vue
<script setup>
import CnPoeTranslator from "cn-poe-translator";//外部依赖
import CnPoeExportDb from "cn-poe-export-db";//外部依赖

const factory = new CnPoeTranslator.BasicTranslatorFactory(CnPoeExportDb);
//...
</script>
```

## 尝试使用`external`选项

我尝试在rollup配置中指定外部依赖：

```js
external: ['cn-poe-translator', 'cn-poe-export-db']
```

然后在index.html中声明模块：

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/cn-poe-export-db@0.1.4/dist/index.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/cn-poe-translator@0.2.8/dist/index.js"></script>
```

构建结果在浏览器执行时，会提示找不到这两个依赖。

```
Uncaught TypeError: Failed to resolve module specifier "cn-poe-translator". Relative references must start with either "/", "./", or "../"
```

## 问题分析

原因在于浏览器环境和node.js环境在使用模块时存在的不同：

- 浏览器的模块只支持基于当前域的上下文的导入路径（即本地依赖），如`/index.js`,`./index.js`,`../index.js`
- node.js支持基于文件上下文的导入路径（即本地依赖），以及支持外部依赖的导入路径，如`import axios from Axios`
## 方法1： 使用importmap

为了支持外部依赖，浏览器提出了[importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)技术，通过映射来支持外部依赖。

在`index.html`中删除类似`<script type="module" ...`的导入外部依赖的语句，添加importmap：

```html
    <script type="importmap">
      {
        "imports": {
          "cn-poe-export-db": "https://cdn.jsdelivr.net/npm/cn-poe-export-db@0.1.4/dist/index.js",
          "cn-poe-translator": "https://cdn.jsdelivr.net/npm/cn-poe-translator@0.2.8/dist/index.js"
        }
      }
    </script>
```

### importmap的缺陷

importmap是一个较新的技术，根据caniuse的[查询结果](https://caniuse.com/?search=importmap)直到2023年，所有主流桌面浏览器才支持该标准，移动浏览器则更晚。

## 方法2：使用iife

在代码中删除导入语句：

```js
<script setup>
// CnPoeTranslator and CnPoeExportDb are imported by index.html
const factory = new CnPoeTranslator.BasicTranslatorFactory(CnPoeExportDb);
//...
</script>
```

然后html中使用外部依赖的iife：

```html
<script src="https://cdn.jsdelivr.net/npm/cn-poe-export-db@0.1.4/dist/db.global.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cn-poe-translator@0.2.8/dist/translator.global.js"></script>
```

这种方式的缺陷在于源码中使用的类型是不安全的，优点是兼容性很好。