# 背景
## Rust的错误设计
Rust使用`Result`来封装可能带`错误`的返回结果，但是并没有对错误类型进行任何限定。

## 标准库的错误实现
标准库使用[std::error::Error](https://doc.rust-lang.org/std/error/trait.Error.html)来约束标准库的错误。

但问题在于**std::error::Error**只是一个`Trait`，Rust是不支持返回`Result<T,std::error::Error>`的。

标准库的解决办法是每个模块定义自己的Error实现，不同实现之间使用`From` trait进行转换，标准库代码内聚明显，少量的`Error`实现和`From`实现就足以覆盖需求。

但是对于应用而言，定义自己的Error实现并编写`From`来覆盖所有Error实现是不现实的。

## 使用`Box<dyn std::error::Error>`
一种灵活的方案是使用是`Box<dyn std::error::Error>`来表示错误（见TRPL），任何实现`std::error::Error` trait的类型都可以由该类型包装并直接返回。

# anyhow
[anyhow](https://docs.rs/anyhow/1.0.69/anyhow/index.html)就是上面方法的封装。

提供了：

- `anyhow::Error`，anyhow定义的错误类型，可以接收任意实现`std::error::Error`的类型（通过`?`直接返回）
- `anyhow::Result<T>`是`anyhow::Result<T,anyhow::Error>`的“别名”（在Rust里该语法叫什么？）
- `anyhow!`使用字符串、格式化字符串创建临时错误
- `bail!`创建错误并返回错误
- `ensure!`执行条件，如果为false，创建并返回错误
- `format_err!`等同于`anyhow!`（不确定，但文档是似乎这样）

