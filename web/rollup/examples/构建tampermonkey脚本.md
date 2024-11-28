# 构建tampermonkey脚本

Tampermonkey目前仅支持IIFE形式的脚本文件，不支持ES Module。

我们需要在配置中声明使用的外部依赖：

```ts
external: [
  "vue",
  "cn-poe-translator",
  "cn-poe-export-db",
  "pob-building-creater",
  "axios",
];
```

其次我们要在配置中说明输出为IIFE格式，并指定外部依赖所提供的全局变量名称：

```ts
output: {
  format: 'iife',
  globals: {
    vue: 'Vue',
    'cn-poe-export-db': 'CnPoeExportDb',
    'cn-poe-translator': 'CnPoeTranslator',
    'pob-building-creater': 'BuildingCreater',
    axios: 'axios'
  }
}
```

最终，我们构建得到如下的IIFE脚本：

```js
(function (vue, axios2, cnPoeTranslator, Assets, pobBuildingCreater) {
  "use strict";
  //...省略内容
})(Vue, axios, CnPoeTranslator, CnPoeExportDb, BuildingCreater);
```

再添加tampermonkey脚本头信息，得到完整的tampermonkey脚本文件：

```js
// ==UserScript==
// @name         CN POE Export
// 省略部分内容
// @require      https://unpkg.com/cn-poe-translator@0.2.8/dist/translator.global.js
// @require      https://unpkg.com/cn-poe-export-db@0.1.4/dist/db.global.js
// @require      https://unpkg.com/pob-building-creater@0.0.13/dist/creater.global.js
// @require      https://unpkg.com/pako@2.1.0/dist/pako_deflate.min.js
// @require      https://unpkg.com/axios@1.6.3/dist/axios.min.js
// @require      https://unpkg.com/vue@3.3.2/dist/vue.global.prod.js
// 省略部分内容
// ==/UserScript==

(function (vue, axios2, cnPoeTranslator, Assets, pobBuildingCreater) {
  "use strict";
  //...省略内容
})(Vue, axios, CnPoeTranslator, CnPoeExportDb, BuildingCreater);
```

这一步可以通过脚本来实现。
