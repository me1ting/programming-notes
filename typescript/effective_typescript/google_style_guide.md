# Google Style Guide

本文是Google的[TS风格](https://google.github.io/styleguide/tsguide.html)阅读笔记。本笔记并非原文的复制粘贴，仅记录个人感兴趣的部分。

## 代码组织

### 导入

存在一类特殊的导入：`副作用导入`。即使是在传统编译型语言中也很少见。

```ts
import '...';
```

导入路径是使用相对路径还是绝对路径，主要取决于习惯。在同一逻辑功能下倾向于使用相对路径，简单而且重构时往往不需要更改导入路径。

### 导出

### 避免使用默认导出

规范认为，应当避免使用默认导出，因为默认导出没有提供规范名称，当使用场景较多时不利于维护。

```ts
import Foo from './bar';  // Legal.
import Bar from './bar';  // Also legal.
```

个人观点：默认导出确实是JS提供的鸡肋语法，除了库在提供接口API时需要可能需要考虑使用默认导出外，一般都是使用命名导出。

>rollup在输出格式为iife时，依赖默认导出

// next 4.4.5 Class members