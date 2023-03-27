# 前言
WPF居然没有原生的数字输入框，这是一个让我吃惊但又不得不接受的事实。

在实现一个数字框时，自己查阅了许多资料，很多复制粘贴的资料并不靠谱。

下面介绍自己经过实践校验后的有效步骤。

# 实现数字输入框
这里不考虑`小数`、`负数`、`科学计数`等情况，目前只考虑自然数。

## 禁用输入法
非纯英文输入法，如中文输入法会导致我们后续的所有手段失效，另一方面，只考虑英文输入有助于简化实现需求。
```xml
<TextBox input:InputMethod.IsInputMethodEnabled="False"/>
```

## 在`PreviewTextInput`事件中检查输入
大多数教程都推荐在`PreviewTextInput`事件中检查输入：

xaml
```xml
<TextBox input:InputMethod.IsInputMethodEnabled="False" PreviewTextInput="NumberValidationOnPreviewTextInput"/>
```

code
```c#
private void NumberValidationOnPreviewTextInput(object sender, TextCompositionEventArgs e)
{
    Regex regex = new Regex("[^0-9]+");
    e.Handled = regex.IsMatch(e.Text);
}
```
其原理是通过正则检查输入文本中是否存在非数字内容，通过`e.Handled = true`来阻止输入。

**但实际测试发现该方法无法检测空格输入的情况**

## 在`PreviewKeyDown`事件中检查输入
大多数教程也会使用到`PreviewKeyDown`事件，但是过于严格，这里只使用该方法阻止空格的输入：

xaml
```xml
<TextBox input:InputMethod.IsInputMethodEnabled="False" PreviewTextInput="NumberValidationOnPreviewTextInput" PreviewKeyDown="NumberValidationOnPreviewKeyDown"/>
```

code
```c#
private void NumberValidationOnPreviewKeyDown(object sender, KeyEventArgs e)
{
    if (e.Key == Key.Space)
    {
        e.Handled = true;
    }
}
```

## 处理复制的情况
以上几个组合拳下去，唯一还需要考虑的是粘贴情况，使用如下设置：

xaml
```xml
<TextBox input:InputMethod.IsInputMethodEnabled="False" PreviewTextInput="NumberValidationOnPreviewTextInput" PreviewKeyDown="NumberValidationOnPreviewKeyDown" DataObject.Pasting="NumberValidationOnPasting"/>
```

code
```c#
private void NumberValidationOnPasting(object sender, DataObjectPastingEventArgs e)
{
    if (e.DataObject.GetDataPresent(typeof(String)))
    {
        String text = (String)e.DataObject.GetData(typeof(String));
        if (!IsNumberic(text))
        { e.CancelCommand(); }
    }
    else { e.CancelCommand(); }
}

private bool IsNumberic(string _string)
{
    if (string.IsNullOrEmpty(_string))
        return false;
    foreach (char c in _string)
    {
        if (!char.IsDigit(c))
            return false;
    }
    return true;
}
```
粘贴时我们检查粘贴内容，如果不符合要求，就阻止粘贴。

# 总结
本文记录了如何在WPF中实现一个简单的纯自然数输入框。

# Refs
https://www.codetd.com/article/9459639
https://www.cnblogs.com/yiyan127/p/wpf-numberictextbox.html
