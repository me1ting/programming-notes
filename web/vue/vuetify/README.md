# About
[vuetify](https://github.com/vuetifyjs/vuetify)是`vue`下最热门的Material-design UI框架。

# 使用
## 安装
vuetify的使用比较复杂，你需要参考其[手动安装说明](https://vuetifyjs.com/en/getting-started/installation/#manual-steps)。

首先需要安装`vuetify`:
```bash
yarn add vuetify@^3.1.11 # 最新的版本号请查阅文档说明
```

然后我们还需要安装插件（插件的功能不仅仅是文档上所说的按需导入所需插件，还包括自定义主题等常用功能），假设你使用的是`vite`，需要安装[vite-plugin-vuetify](https://www.npmjs.com/package/vite-plugin-vuetify)

```bash
yarn add vite-plugin-vuetify
```
我们首先需要定义插件：
```ts
// plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify()
```
然后我们需要在vite的配置文件中注册插件：
```json
// vite.config.js
import vuetify from "vite-plugin-vuetify";
plugins: [
  vue(),
  vuetify({ autoImport: true }), // Enabled by default
]
```
使用了插件，我们就不需要在创建vue应用时使用`use()`来使用vuetify了，插件会帮我们导入。

## 常用功能（按需使用）

以上配置只是将vuetify导入了我们的vue项目，实际使用还需要更多的设置。

### 设置MD版本
Material-design存在多个版本，而vuetify对其都进行了支持。

设置方式参考[文档说明](https://vuetifyjs.com/en/features/blueprints/)：
```ts
//以下内容省略了其它配置内容
import { md2 } from "vuetify/blueprints";

export default createVuetify({
    blueprint: md2,//这里设置为Material-design V2
});
```

### 使用icon
大多数情况下，我们只需要使用Material-design自带的icon，推荐使用[按需加载](https://vuetifyjs.com/en/features/icon-fonts/#material-design-icons-js-svg)模式。

需要安装`mdi/js`包，其提供了javascript封装的icon：
```bash
yarn add @mdi/js -D
```
然后在`plugins/vuetify.ts`中设置如下：
```ts
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";//这里导入了Vuetify本身需要的icon，以及icon集合占位符
import {
    mdiCheckCircleOutline,
} from "@mdi/js";//按需导入

export default createVuetify({
    icons: {
        defaultSet: "mdi",
        aliases: {
            ...aliases,
            checkCircleOutline: mdiCheckCircleOutline,
        },//定义别名
        sets: {
            mdi,
        },
    },
});
```

在组件中使用：
```html
<v-icon
  color="green"
  icon="$checkCircleOutline"
/>
```

我们可以使用这个[网站](https://pictogrammers.com/library/mdi/)来查询用到的mdi icon名称。

## 主题
Material-design定义了一套UI风格，但是预留了基于颜色的自定义风格供程序使用，称其为`主题`。

参考[文档说明](https://vuetifyjs.com/en/features/theme/)，在vuetify中如下定义和使用主题：
```ts
// plugins/vuetify.ts
import { type ThemeDefinition } from "vuetify";

const lightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: "#FFFFFF",
        surface: "#FFFFFF",
        primary: "#5B5C9D",
        "primary-darken-1": "#3700B3",
        secondary: "#9C27B0",
        "secondary-darken-1": "#018786",
        "text-secondary": "#909399",//这是一个自定义color
        error: "#B00020",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00",
    },
};

export default createVuetify({
    theme: {
        defaultTheme: "lightTheme",
        themes: {
            lightTheme,
        },
    },
});
```
大多数vuetify的组件都提供了`color`属性来设置主题颜色：
```vue
<v-btn color="primary">Save</v-btn>
```
文本的颜色设置比较独特，使用`text-${colorname}`来设置颜色：
```vue
<p class="text-read"></p><!---->
```
这些颜色可以是[预定义颜色](https://vuetifyjs.com/en/styles/colors/#material-colors)，或者通用主题颜色，或者自定义主题颜色。