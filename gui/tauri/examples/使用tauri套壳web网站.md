# 使用tauri套壳web网站

这是v2ex上的一个[需求](https://www.v2ex.com/t/1013792#reply38)：

作者所在公司提供的是web应用，很多客户使用的国产浏览器由于内核太旧，存在兼容性问题，即使安装了Chrome，过不久还是被流氓软件锁定了默认浏览器。

目前的解决办法是使用electron进行套壳，作者尝试使用tauri套壳，但没有成功。

由于我使用过tauri，因此就试着并成功解决了问题。

## 跳转站点

webview2本身是一个完备的浏览器，因此可以使用浏览器的跳转方式：

```js
window.location.href = "www.google.com";
```

另一方面，也可以使用webview的api，设置初始化站点，参考该[链接](https://github.com/tauri-apps/tauri/issues/986)。

## 修改header

作者所在公司使用不同的header来区分客户端还是web端访问。

但目前tauri并没有提供相关的接口，这需要直接访问tauri使用的底层webview技术。

### webview2

考虑该桌面端应用主要是Windows用户使用，这里只介绍webview2下的使用。

作者给出的代码已经很完整了，但是由于涉及到win32 api，以及使用的是Rust语言（一些语法很奇怪，除非系统学习很难fix语法错误），因此存在一些语法错误难以修复。

这些语法错误最终由我进行了修复。

以下是完整的main.rs：

```rust
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use webview2_com::{
    Microsoft::Web::WebView2::Win32::{
        ICoreWebView2WebResourceRequest, COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL,
    },
    WebResourceRequestedEventHandler,
};
use windows::{core::HSTRING, Win32::System::WinRT::EventRegistrationToken};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            main_window
                .with_webview(|webview| unsafe {
                    let core = webview.controller().CoreWebView2().unwrap();
                    let mut _token: EventRegistrationToken = EventRegistrationToken::default();
                    core.AddWebResourceRequestedFilter(
                        &HSTRING::from("*"),
                        COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL,
                    )
                    .unwrap();
                    core.add_WebResourceRequested(
                        &WebResourceRequestedEventHandler::create(Box::new(
                            move |_webview, args| {
                                if let Some(args) = args {
                                    let request: ICoreWebView2WebResourceRequest =
                                        args.Request().unwrap();
                                    request
                                        .Headers()
                                        .unwrap()
                                        .SetHeader(&HSTRING::from("key1"), &HSTRING::from("value1"))
                                        .unwrap();
                                }
                                Ok(())
                            },
                        )),
                        &mut _token,
                    )
                    .unwrap();
                })
                .unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

需要添加以下依赖（为了避免兼容性问题，与 tauri 的依赖版本保持一致）

```toml
[dependencies]
webview2-com = "0.19.1"
windows = "0.39.0"
```

## 参考资料

[doc: webview2 win32 api](https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32)<br/>webview2的win32 api文档
[github: tauri如何自定义origin头？](https://github.com/tauri-apps/tauri/discussions/4912)这里的代码就是作者贴的代码，但是存在语法错误<br/>
[stackoverflow: How to replace the response in the webview2 using rust](https://stackoverflow.com/questions/77562483/how-to-replace-the-response-in-the-webview2-using-rust)这帮助我修复了一个语法错误<br/>
[stackoverflow: 如何从String类型得到PCWSTR类型](https://stackoverflow.com/questions/74173128/how-to-get-a-pcwstr-object-from-a-path-or-string)这帮助我修复了另一个语法错误<br/>
[github: 自定义user-agent](https://github.com/tauri-apps/tauri/issues/4284)如果要支持多平台，可以参考这个问题的答案
