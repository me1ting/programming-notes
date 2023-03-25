# 常见错误

## illegal base64 data at input byte 0

错误信息表明byte[0]是base64无法识别的字节，可能是由于`UTF8-BOM`格式的原因。