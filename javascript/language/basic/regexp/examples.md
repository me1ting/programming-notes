# 示例
## 检查文本是否是ASCII

```javascript
function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}
```

ref: https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only

