# 区分panic和error

panic是无法恢复的错误，在告知用户后立即退出程序。

error是可以恢复的错误，告知用户，提示处理。

# 避免使用unwarp/expect/panic

这些方法会使得应用闪退，不是GUI程序的正确错误处理方式。

即使某些地方看起来不会发生错误，也不应该使用`unwarp/expect/panic`，防御性编程能够避免`1%`发生错误的情况。

```rust
match CONFIG_MANAGER.set(manager) {
    Ok(()) => Ok(()),
    Err(_) => Err(anyhow::anyhow!("it should never happen")),//尽管99.99%可能不会发生错误，依然避免使用`unwarp`而是转换为错误
}
```

使用系统原生 [message](https://docs.rs/tauri/1.2.4/tauri/api/dialog/fn.message.html) 机制告知用户是合理且简单的方式：

```rust
/// Use blocking native message dialog to show error.
///
/// Should NOT be used when running on the main thread context, unless you end the program after.
///
/// The function only to show error causing panic, and you should end the program after.
pub fn panic_dialog(err: &anyhow::Error) {
    dialog::blocking::MessageDialogBuilder::new("Error", format!("{:#}", err))
        .kind(dialog::MessageDialogKind::Error)
        .show();
}
```

然后执行退出：

```rust
//可以访问app时
app.handle().exit(-1);
//不方便访问app时
std::process.exit(-1);
```

如果不嫌麻烦，使用`Web UI`来通知用户也是可以的，从交互的一致性来说更好。

# 记录日志

日志虽然对普通用户并不友好，但是它提供了独有的持久化错误的方式，多了一道保障。

记录日志的`切面`主要有两个：

- `setup`闭包中记录启动阶段出现的 `panic`
- `command`层记录运行阶段出现的`error`

所有其它传播路径并未经过这两个切面的错误，都应当在其传播路径的末尾对其进行日志记录。

# 典型的处理模式

应用的生命周期可以分为：

- 启动阶段
- 运行阶段

在启动阶段，`panic`较多，使用系统原生diablog通知用户并立即退出是很好的方法。

在运行阶段，尽量避免将错误归类为`panic`，使用错误传递机制从底层往上传递，一般在IPC(Command)层使用日志记录错误，传递给web ui后由其显示给用户。
