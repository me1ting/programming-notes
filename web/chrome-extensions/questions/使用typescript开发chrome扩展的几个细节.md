# 使用typescript开发chrome扩展的几个细节

## 给Chrome API添加类型信息

存在2个Chrome API类型信息的TS库：

- [chrome-types](https://www.npmjs.com/package/chrome-types)这是由typescript官方维护的库
- [@types/chrome](https://www.npmjs.com/package/@types/chrome)这是由typescript社区维护的库，基于chrome-types，但提供一些额外的优化

大多数情况下，使用两者并没有什么区别。选择其中一个，安装为开发时依赖：

```
pnpm add -D @types/chrome
```

### 启用类型信息

Chrome API 通过全局对象`chrome`暴露API，我们并不能像使用外部依赖一样使用这些类型信息：

```ts
import axios from Axios 
import chrome from chrome// 错误的，chrome并不是外部依赖
```

那么如何使用呢？

这里要使用到TS的特殊语法（我目前还没有归类该语法），在任意TS文件顶部添加：

```ts
/// <reference types="chrome"/>
```

编译器就会识别到启用了Chrome API的类型信息。