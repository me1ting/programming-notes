# TextField

[TextField](https://api.flutter.dev/flutter/material/TextField-class.html)是文本字段控件：

```dart
  Widget build(BuildContext context) {
    return const SizedBox(// 必须使用限制大小的容器包裹文本字段组件
      width: 250,
      child: TextField(
        obscureText: false,
        decoration: InputDecoration(//装饰器
          border: OutlineInputBorder(),
          labelText: 'Password',
        ),
      ),
    );
  }
}
```

TextField常用以下属性：

- `obscureText`，是否模糊内容，也就是密码框效果默认false
- `decoration`，装饰器，比如边框、标签、提示语等

## FAQ

### 自定义border颜色

通过自定义`decoration`属性的`border`,`enabledBorder`,`focusedBorder`属性来实现。如：

```dart
decoration: InputDecoration(
  border: OutlineInputBorder(),
  enabledBorder: OutlineInputBorder(),
  focusedBorder: OutlineInputBorder(),
),
```

### 实现紧凑的文本字段控件

![](_images/Pasted%20image%2020240216101035.png)

通过设置装饰器的`isDense`属性值为`true`，和`contentPadding`来实现：

```dart
TextField(
  decoration: InputDecoration(
    isDense: true,
    contentPadding:
      EdgeInsets.symmetric(vertical: 10, horizontal: 5.0),
  ),
  style: TextStyle(fontSize: 16.0, height: 1.1),
)
```
