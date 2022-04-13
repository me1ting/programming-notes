# 为什么要编译非Vue文件？

Vue CLI创建的项目，有它自己的入口，是一个js文件，有对应的html文件，这个js文件的功能是创建单页应用并挂载到目标页面的某个元素中。

但是有时我们想要编译不属于Vue项目的js文件，比如我们使用Vue CLI创建了一个Chrome扩展项目，但是有些`内容脚本`是纯js文件，不需要使用Vue那一套，因为存在外部依赖，需要将其**编译**而非复制的方式生成目标js文件。

# 如何配置

我们需要以Vue CLI理解的方式，添加webpack entry。通过配置`chainWebpack属性`：

```javascript
module.exports = {
  chainWebpack: config => {
    config
      .entry('trade')
        .add('./src/js/trade.js')
  }
}
```

> 一个entry对应一个页面下的所有脚本文件，它有一个名称，包含一个或多个js文件。
>
> 更多关于webpack entry的概念，参考https://webpack.js.org/configuration/entry-context/#entry