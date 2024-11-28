# 了解WASM

## WASM是什么？

WASM是一套字节码，其目的是在浏览器平台上提供接近原生性能的能力。

## WASM的应用领域

WASM官网介绍了所有WASM的[使用场景](https://webassembly.org/docs/use-cases/)。

WASM主要是在浏览器中执行，使用[JS API](https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API)对WASM数据进行加载、执行等操作，适合用于**执行前端项目中对性能比较在意的子任务**。典型的案例包括：

- 一些传统桌面软件将其C++编写的GUI程序迁移到Web平台，如Photoshop,AutoCAD
- [长桥App](https://mp.weixin.qq.com/s/-_NLEbonjEl1F2kyA0yx_A)使用基于C++的跨平台ImGui来复用代码，在Web平台上使用WASM实现

在云计算、[边缘计算](https://unbug.github.io/Pushing-Serverless-to-the-Edge-with-WebAssembly-Runtimes/)领域，采用serverless的WASM相比Docker解决方案具有更好的冷启动速度（即轻量）。

## JS与WASM

由于浏览器的原因，开发者可能会先入为主的以为JS和WASM关系亲密，但其实不然，**浏览器只是WASM的运行平台而非开发环境**。

目前最适合编译为WASM的高级编程语言有C/C++,Rust。JS并不支持编译为WASM，存在两种间接方案：

- 使用`assemblyscript`，一种类似`TS`的编程语言来编写代码，本质上就是重写，那为何不用C/C++,Rust呢？
- 将`quickjs`编译为`WASM`，由它来解释执行JS代码，[Figma](https://www.reddit.com/r/WebAssembly/comments/kjk7t5/comment/ggypnip/?utm_source=share&utm_medium=web2x&context=3)使用这种方案来支持插件，[WasmEdge](https://github.com/WasmEdge/WasmEdge)使用这种方式来支持JS。WASM与quickjs带来的双重性能衰减，使得这种方案并不适合需要性能的任务。

## 我的一些需求

### 将JS编译为WASM，然后提供给后端FFI调用

我有一个JS库，需要交给后端使用，因此我想能否使用WASM来实现。

当我研究后，发现JS并不适合编译为WASM，所以我最后使用quickjs来提供FFI功能。
