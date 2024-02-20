# 使用flutter_js执行javascript代码
## 前言

个人在迁移一款electron应用到flutter中，其核心代码是typescript编写的，而且复用在了其它web项目中。

重写核心库是不现实的，因为web项目还在用，而且我也没有时间精力和兴趣去重写并同时维护两套不同语言编写但是功能相同的库。

那么如何让flutter也能调用javascript库呢？

## 调研

一开始，因为dart支持构建目标为web平台，我认为这应该是很容易实现的，但实际研究后发现并不是那样。

dart目前的[js互操作性](https://dart.dev/web/js-interop)只在构建目标为web平台时才能使用。对于桌面平台、移动平台，dart并没有提供类似的功能。

因此，只能通过ffi这种传统的方式来实现dart调用js代码。

经过google，找到了[flutter_js](https://pub.dev/packages/flutter_js)这个库，同时它还提到了一些[相关的库](https://github.com/abner/flutter_js#alternatives-and-also-why-we-think-our-library-is-better)也能干类似的事情。

这些库的基本思路是通过ffi调用第三方js运行时或原生运行时（移动平台），比如`quickjs`,`v8`,`native JavascriptCore`(ios)等等。

## 使用flutter_js

`flutter_js`的使用细节可以参考文档，这里记录自己遇到的问题和解决办法。

### 如何调用复杂的脚本？

`flutter_js`在[文档](https://pub.dev/packages/flutter_js)中提供了最基本的flutter调用javascript代码的示例：

```dart
JsEvalResult jsResult = flutterJs.evaluate(
                  "Math.trunc(Math.random() * 100).toString();");//最后一行产生返回结果
String result = jsResult.stringResult;//返回结果是字符串
```

但是现实需求往往是很复杂的，如何执行复杂的调用需求，比如第三方库提供的API？

解决办法是将所用到的javascript代码构建为单一的`.js`文件，通过flutter的`assert`功能加载文件内容，然后拼接成被调用的javascript指令：

```dart
final JavascriptRuntime jsRuntime = getJavascriptRuntime();
String jsFile = await rootBundle.loadString("assets/js/translator.js");
var jsResult = jsRuntime.evaluate("""
    ${jsFile}translateItems()
    """);

return jsResult.stringResult;
```

官方文档中的[ajv](https://pub.dev/packages/flutter_js#ajv)示例的原理也是一样的，只是进行了一些封装。

### 传递字符串参数

我们是以拼接的脚本文件进行ffi调用，如何向js函数传递字符串参数？

```dart
jsFile = await rootBundle.loadString("assets/js/translator.js");
var jsResult = 
    jsRuntime.evaluate('${jsFile}hello("$name");');
```

这是错误的，假设名字是`A"B`，那么，生成的脚本内容是：

```js
//省略 jsFile
hello("A"B");
```

这和js的语法是冲突的，我们需要对字符串内容进行转义。

解决办法是使用`jsonEncode`函数，得到的内容是满足js语法的：

```dart
var jsResult = 
    jsRuntime.evaluate('${jsFile}hello(jsonEncode($name));');
```

其中，`jsonEncode($name)`的结果是：

```dart
print(jsonEncde("A\"B"));
//输出："A\"B"
```

### 传递对象参数

我们可以传递object给javascript：

```javascript
function rename(user){
	user.name = "new name";
	return JSON.stringify(user);
}
```

只要这个object是以json的形式存在：

```dart
var user = User();
var userJson = user.toJson();
var jsResult = 
    jsRuntime.evaluate('${jsFile}rename($userJson);');
user = User.fromJson(jsResult);
```
