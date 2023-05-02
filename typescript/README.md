# 2023.01

在过去，我认为`JavaScript`足够用，又因为前端非我喜欢的方向，一直抗拒学习`TypeScript`。但后来我需要开发一些相对复杂的前端项目时，`JavaScript`提供的抽象确实不那么够用，接触TypeScript就成了项目需求。

以前也接触过类似的扩展语言，比如`Java`平台上的`Groovy`，但它带给我的总体体验一般。首先这与我过去的错误的学习方法有关：过于看重语法。`Groovy`为`Java`添加了太多不实用的函数式编程语法，在接触它们时让我心力交瘁。其次是`Groovy`与`Java`的某些语法存在冲突，让我不太适应。最后是`Groovy`的某些语法与主流语言存在冲突。总之，在我看来，`Groovy`是一门设计一般的语言。

扩展语言因为依托于原有平台，如何恰到好处的补充原有语言的不足但不添加新的困扰，如何在原有语言版本更新后不产生冲突，等等问题，都是考验设计者的关键之处。TypeScript属于Microsoft，因此拥有充足的资源，并且它作为Microsoft插手前端的重要一环，其在Microsoft内部也比较被看重。在这种基础之上，以及基于目前的口碑，TypeScript应该值得一学。

# 阶段总结：2023.04

过去几个月使用TypeScript写过了一些代码，给我的体验很不错。但还是存在一些问题：

CommonJS与ES Module的兼容性依然是一个黑洞，虽然存在一些解决方案，但没有一个简单、兼容性足够的方案，目前我强制所有项目使用`Module`模式，但是在使用第三方依赖时或多或少会存在一些问题。

对于拆分文件的项目，不要使用`tsc`而应当使用`rollup`之类的构建工具，`tsc`只是简单的将`.ts`翻译为`.js`，而且在import路径中丢失`.js`后缀，导致其它项目将该项目作为库时，会遇到找不到引用路径的问题。这个问题是新手最容易遇到的坑，可以在stackoverflow上看到类似的问题：[如何在TypeScript编译时给import路径添加`.js`后缀](https://stackoverflow.com/questions/62619058/appending-js-extension-on-relative-import-statements-during-typescript-compilat)