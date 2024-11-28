# 异常处理

本文只关注RestController相关的异常处理。SpringMVC提供了两个级别的异常处理方式：

- Controller级别
- 全局级别

## Controller级别

控制器级别的异常处理需要使用`@ExceptionHandler`：

```java
@ResponseStatus(value=HttpStatus.CONFLICT, reason="Data integrity violation") // 409
@ExceptionHandler(DataIntegrityViolationException.class)
public ApiResult conflict() {
	// Nothing to do
}
```

实际开发时，对于错误，我们要使用准确的Http状态码，这可以使用`@ResponseStatus`来完成，可以携带错误消息。

但对于真正的现实业务，我们通常会返回自己的业务错误码以及错误消息，这时可以返回ResponseEntiry，来携带自己的错误数据并设置HTTP状态码。

```java
@ExceptionHandler(IllegalStateException.class)
public ResponseEntity<ApiResult<?>> conflict() {
	//
	var result = ApiResult.error(ApiCode.BadRequest.code(), null, "参数错误");
	return new ResponseEntity<ApiResult<?>>(result, HttpStatus.BAD_REQUEST);
}
```

## 全局级别

使用`@ControllerAdvice`来封装对所有异常的处理：

```java
@@ControllerAdvice
publi class GlobalControllerExceptionHandler {
	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ApiResult<?>> conflict() {
		//
		var result = ApiResult.error(ApiCode.BadRequest.code(), null, "参数错误");
		return new ResponseEntity<ApiResult<?>>(result, HttpStatus.BAD_REQUEST);
	}
}
```

特别的，Spring为RestController提供了一个基础类型`ResponseEntityExceptionHandler`，其默认实现了`RFC 7807`规范：

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation failure",
  "instance": "/api/originalBuild"
}
```

## 参考资料

[doc: 错误响应](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html)
