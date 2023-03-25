# 为了复用http连接，在关闭resp前读取其内容
为了复用http连接，在关闭resp前读取其内容，否则底层实现会选择关闭连接。而对于http，复用通常效率更高。

参考：[is resp.Body.Close() necessary if we don't read anything from the body?](https://stackoverflow.com/questions/18598780/is-resp-body-close-necessary-if-we-dont-read-anything-from-the-body)