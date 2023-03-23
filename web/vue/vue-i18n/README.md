# v8 vs v9
vue-i18n存在两个版本`v8`和`v9`，前者用于`vue2`后者用于`vue3`。

本笔记记录的是在`vue3`上使用的`v9`版本。

# 安装
[文档](https://vue-i18n.intlify.dev/guide/installation.html)

# 基本使用
vue3提供了`选项式`（vue2的旧风格）和`组合式`两种使用风格，而在其之上的插件也随之提供了两种风格，不同风格使用细节存在差异。

后续使用的是`组合式`风格。

采用如下文件组织：
```
src/
    i18n/
        i18n.ts //定义messages
        zh_CN.ts //中文文本资源
        en_US.ts //英文文本资源
```

i18n.ts:
```ts
import en_US from "./en_US";
import zh_CN from "./zh_CN";

export const messages = {
    zh_CN,
    en_US,
};
```
zh_CN.ts:
```ts
export default {
    hello: "你好";
}
```
en_US.ts:
```ts
export default {
    hello: "hello";
}
```

在创建`vue`应用时加入i18n功能：
```ts
import { messages } from "./i18n/i18n";
import { createI18n } from "vue-i18n";

const locale: Language = "zh_CN";

const i18n = createI18n({
    legacy: false,//使用组合式API
    locale,//当前locale
    fallbackLocale: "en_US",//回退locale
    messages,//文本资源
});

createApp(App).use(i18n).mount("#app");
```

在组件中使用：
```ts
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const hello = t('hello');//在逻辑代码中使用
</script>

<template>
{{t('hello')}}<!--在模板中使用-->
</template>
```

# FAQ
## 初始化全局locale
在创建`vue`应用时我们指定了locale，但某些应用可能需要延迟设置locale，因此我们可以在应用的`root`组件的`mount`生命周期进行locale的修改（近似初始化的效果）：
```ts
onMounted(async () => {
    locale.value = await getLocale();//通过网络、IPC、cookie等方式获取
});
```

## 修改全局locale
需要暴露全局local给组件：
```ts
const { t,locale } = useI18n();

function doSomething(){
    locale.value = "en_US";
}
```