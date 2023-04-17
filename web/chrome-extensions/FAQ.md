# 扩展如何访问cookie？
chrome扩展有两种访问[cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)的方法：

- 在内容脚本中使用[document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) API
- 使用扩展的[chrome.cookies](https://developer.chrome.com/docs/extensions/reference/cookies/) API

## document.cookie
仅限在内容脚本中使用，无法访问具有 [httponly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies) 属性的cookie。

## chrome.cookies
不能在内容脚本中使用（未验证），可以访问任意cookie。

# 内容脚本如何发起CORS请求？
扩展是[无法直接发起CORS请求的](https://www.chromium.org/Home/chromium-security/extension-content-script-fetches/)，需要使用`background`来实现。