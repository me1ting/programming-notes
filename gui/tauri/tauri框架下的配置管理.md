# 前言

由于`Rust`语言的限制，在使用tauri来实现config管理时遇到了许多问题，看了一些实现，这里以作记录。

# 几个实现

## clash-verge

[clash-verge](https://github.com/zzzgydi/clash-verge)是一个类似`clash for windows`的代理桌面GUI工具。

其配置使用`全局静态变量`来存储：

```rust
impl Config {
    pub fn global() -> &'static Config {
        static CONFIG: OnceCell<Config> = OnceCell::new();//使用OnceCell来实现延迟初始化

        CONFIG.get_or_init(|| Config {
            clash_config: Draft::from(IClashTemp::new()),
            verge_config: Draft::from(IVerge::new()),
            profiles_config: Draft::from(IProfiles::new()),
            runtime_config: Draft::from(IRuntime::new()),
        })
    }
// ...
}
```

在`main`函数中执行了部分配置初始化逻辑：

```rust
fn main() -> std::io::Result<()> {
    //...
    crate::log_err!(init::init_config());//R: 初始化部分配置文件
    //...
```

然后在`tauri::Builder.step`生命周期挂载另一部分配置初始化逻辑：

```rust
log_err!(Config::init_config());//R: 初始化另一部分配置文件
```

配置文件存储路径是通过手动拼接的，而没有使用到tauri预定义的[默认路径](https://docs.rs/tauri/1.2.4/tauri/struct.PathResolver.html#method.resource_dir)

配置信息的读、写、存储是通过特定抽象来实现的：

```rust
#[derive(Debug, Clone)]
pub struct Draft<T: Clone + ToOwned> {
    inner: Arc<Mutex<(T, Option<T>)>>,//R: 使用parking_lot的同步互斥量
}
//...
```

通过一个互斥量来保证操作的线程安全。

## ChatGPT

[ChatGPT](https://github.com/lencx/ChatGPT)是`ChatGPT`的桌面封装。

其配置文件的实现比较简单，没有做任何线程安全处理：

```rust
  #[command]
  pub fn get_app_conf() -> AppConf {
    AppConf::read()//直接从文件读取
  }

  #[command]
  pub fn form_confirm(_app: AppHandle, data: serde_json::Value) {
    AppConf::read().amend(serde_json::json!(data)).write();//读取、合并、写入文件
  }
```

配置存储路径也是通过手动拼接的，没有使用tauri预定义的默认路径。

```rust
  pub fn file_path() -> PathBuf {
    app_root().join(APP_CONF_PATH)
  }
```

# 一些思考

## 配置的存储路径

以Windows为例，主要有以下几种路径选择：

- `C:\Users\me\{identifer}`，`identifer`一般以`.`开头
- `C:\Users\me\.config\{identifer}`，这其实是Linux平台的标准配置路径
- `C:\Users\me\AppData\Roaming\{bundle.identifer}`，标准路径，tauri采用的就是该路径
- `{app_floor}\`，便携版/绿色版软件一般将配置文件存储在应用根目录

用户文件夹(如`C:\Users\me`)可以通过`tauri::api::path::home_dir()`来获取。

标准数据目录(如`C:\Users\me\AppData\Roaming`)可以通过` tauri::api::path::config_dir`来获取。

`bundle.identifer`在`tauri.conf.json`中定义，一般在`setup`生命周期中使用`PathResolver`来解析与之相关的路径：

```rust
tauri::Builder::default()
  .setup(|app| {
    let resource_path = app.path_resolver()
      .resolve_resource("../assets/logo.svg")
      .expect("failed to resolve resource dir");
    Ok(())
});
```

可执行文件所在目录可以使用`tauri::utils::platform::current_exe()`来获取。

### 使用哪一种路径？

使用哪种路径并没有优劣之分，这里需要探讨的是使用手动拼接，还是使用`PathResolver`来解析。

手动拼接需要硬编码相关`identifer`，但考虑`identifer`一般固定后很少会改变，硬编码是可以接受的。

使用`PathResolver`的优势是更具有可维护性，但是只能在`setup`生命周期中使用。

## 是否进行线程安全处理？

Rust一旦使用了异步技术，复杂度明显上升。

对绝大部分场景，对配置文件的读写是同步的、低频率的，不进行线程安全处理是可以接受的，就像上面的`ChatGPT`示例一样。

但是在条件允许的情况下，编写健壮性的代码是更好的。

### 使用哪种同步技术？

tauri使用的是`tokio`，在tokio的文档上对3种同步技术进行了[讨论](https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html#which-kind-of-mutex-should-you-use):

- 同步锁/互斥量...，由标准库和parking_lot提供，如果锁定的作用域不包含异步代码（指调用`.await`），那么是安全的，但是如果包含了异步代码，那么是不安全的
- 异步锁/互斥量...，由tokio提供，相比同步版本，保证了`.await`安全，但是性能降低
- 消息机制

消息机制的问题在于编写难度较大，考虑配置访问的低频率，使用消息机制有些大材小用了。

个人推荐使用同步锁+同步io来保证读写配置的线程安全。

## 全局变量(静态变量)

因为tauri的`#[tauri::command]`必须使用在函数上，因此配置管理对象应当是“全局变量”（Rust中称为`静态变量`）(如`clash-verge`)或者“全局函数”(如`ChatGPT`)。

但是默认情况下，使用`可变静态变量`是**不安全**的，需要使用`unsafe`代码，或者使用第三方库，如`once_cell`。
