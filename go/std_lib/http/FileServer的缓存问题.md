# FileServer的缓存问题

## 遇到的问题

使用`http.FileServer`实现了一个简单的static web server。

但是在更新web内容时，发现页面使用的是缓存，始终没法加载最新的web文件。

## 分析问题

使用chrome开发者工具，发现服务端首次返回的响应类似如下：

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 154093
Content-Type: image/png
Last-Modified: Mon, 24 Jul 2017 17:26:46 GMT
Date: Mon, 24 Jul 2017 17:29:32 GMT
```

后续请求时会直接使用缓存，而不对服务端进行访问。

在复习http缓存知识后，得知此时浏览器使用的是[启发式缓存](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#heuristic_caching)，等价于`Cache-Control: must-revalidate`，由于服务端没有返回缓存失效时间，使用浏览器自己计算的失效时间。

刷新和强制刷新（ctrl+f5）会要求浏览器验证缓存的有效性，但是这个方法对js和css等资源文件无效的，而且对用户不友好。

## 解决办法

覆盖默认的启发式缓存行为，根据实际情况显式设置缓存策略。

如果服务端是放在nginx等反向代理之后，那么禁用cache，由反向代理提供cache：

```go
w.Header().Set("Cache-Control", "no-store")
```

如果客户端直接暴露http服务，那么就要遵循基本的http缓存实践规范：

- http页面不缓存（`Cache-Control: no-store`）。或者检查缓存（`Cache-Control: no-cache`），配合`Last-Modified`头（http.Server自动设置）或者`ETag`头（需要自己设置）使用。
- js,css之类的资源文件可以使用缓存（`Cache-Control: must-revalidate`），但是必须添加版本信息/hash到文件名称或者请求参数中。对于资源文件，也可以采用`检查缓存`。

## 附录：demo

一个使用ETag检查缓存的FileServer：

```go
package main

import (
	"errors"
	"fmt"
	"hash/crc32"
	"net/http"
	"os"
	"path"
	"time"
)

// 一个使用ETag作为检查缓存策略的FileServer
func FileServer(root string) http.Handler {
	return &fileHandler{
		handler: http.FileServer(http.Dir(root)),
		root:    root,
	}
}

type fileHandler struct {
	handler http.Handler
	root    string
}

func (h *fileHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	filePath := path.Join(h.root, r.URL.Path)
	stat, err := os.Stat(filePath)
	if err == nil {
		if stat.IsDir() {
			// 如果是目录，默认为index.html
			indexFile := path.Join(filePath, "index.html")
			stat, err = os.Stat(indexFile)
			if err == nil {
				filePath = indexFile
			}
		}
	} else {
		// 请求路径允许省略.html后缀
		if errors.Is(err, os.ErrNotExist) {
			htmlFile := filePath + ".html"
			stat, err = os.Stat(htmlFile)
			if err == nil {
				filePath = htmlFile
				r.URL.Path = r.URL.Path + ".html"
			}
		}
	}

	if stat != nil && !stat.IsDir() {
		etag, err := h.getEtag(filePath, stat.ModTime())
		if err == nil {
			w.Header().Set("Etag", etag)
		}
	}

	w.Header().Set("Cache-Control", "no-cache")
	h.handler.ServeHTTP(w, r)
}

// 自定义etag实现，unix修改时间+crc32值
func (h *fileHandler) getEtag(filePath string, modtime time.Time) (string, error) {
	dat, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf(`"%d%d"`, modtime.Unix(), crc32.ChecksumIEEE(dat)), nil
}
```