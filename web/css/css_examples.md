# 颜色

## 透明度

### 设置背景透明时，如何避免文字透明？

这种情况下是使用了[opacity](https://developer.mozilla.org/zh-CN/docs/Web/CSS/opacity)，opacity会将元素作为一个整体看待，子元素**强制**受到父元素opacity属性的影响，即使你设置子元素的opacity属性为1也没用。

如果只是背景图案透明度，应当使用带有alpha通道的[background](https://developer.mozilla.org/en-US/docs/Web/CSS/background)属性：

```
background: rgba(0, 0, 0, 0.4);
```
