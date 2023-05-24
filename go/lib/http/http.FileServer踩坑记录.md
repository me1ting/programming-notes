# 场景

需要实现一个简单的static web server，因此使用`http.FileServer`。

但是在更新web时，发现页面使用的是缓存而始终没法加载最新的web文件。

# 分析

使用chrome开发者工具会发现，服务端首次返回的响应类似如下：

```
% curl -I http://localhost:8100/compelling.png
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 154093
Content-Type: image/png
Last-Modified: Mon, 24 Jul 2017 17:26:46 GMT
Date: Mon, 24 Jul 2017 17:29:32 GMT
```

后续请求时会直接使用缓存，而不对服务端进行访问。

经过复习http缓存知识后，得知在这情况下，浏览器使用的是[启发式缓存](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#heuristic_caching)，等价于`Cache-Control: must-revalidate`，由于服务端没有返回缓存失效时间，失效时间是由浏览器自己计算的。

刷新和强制刷新会要求浏览器验证缓存的有效性，但是对于js和css等资源文件是无效的。

# 解决

不要使用启发式缓存，根据实际情况显式设置缓存策略。

如果服务端是放在nginx等反向代理之后，那么在`http.Server`处理之前关闭禁用cache，由反向代理提供cache：

```go
w.Header().Set("Cache-Control", "no-store")
```

如果客户端直接暴露http服务，那么就要遵循基本的http缓存实践：

- http页面不缓存（`Cache-Control: no-store`），或者必须检查缓存（`Cache-Control: no-cache`），配合`Last-Modified`头（http.Server自动设置）或者`ETag`头（需要自己设置）
- js,css之类的资源文件可以使用`Cache-Control: must-revalidate`，但是必须添加版本信息/hash到文件名称或者请求参数中。资源文件也可以采用`检查缓存`策略。

# 附录：demo

一个使用ETag检查缓存策略的FileServer：

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