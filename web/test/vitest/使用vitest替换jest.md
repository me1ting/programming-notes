# 在自己项目中遇到的问题

我接触现代前端工程的时间很短（2022~2023），在这个时间段，ES Module已经是可以与CommonJS分庭抗争的JS模块解决方案。

在自己写的几个项目中，没太注意模块的问题，是按照ES Module来编写的，但没有刻意去遵循特定的解决方案，只是简单的使用`export`,`import`，最终碰到了兼容性问题。

一开始，我的解决办法是不再采用混合模式（默认），而是明确的要求使用ES Module:

- 在`package.json`中设置`"type": "module"`
- 在`tsconfig.json`中设置`"module": "ESNext"`,`"moduleResolution": "nodenext"`（`node16`与之等价，但为了保持一致性，使用`nodenext`）

在vscode的提示下，将所有import路径添加`.js`后缀：

```ts
import { AttributeProvider } from "./provider/attribute.provider.js";
//...
```

此时jest出现模块无法解析的问题，使用各种办法都没法解决。在Github上找到了同样的问题反馈：[jest-config can't import TS file with moduleResolution: node16](https://github.com/jestjs/jest/issues/13350)，但是被jest维护人员忽略了。

可以认为，jest迟迟的不肯完整的支持ESModule，因此只能使用别的测试解决方案。

在上面的链接中，issue发起者推荐使用`vitest`，经过尝试，确实能解决我的问题。

# 使用vitest

安装：

```
yarn add -D vitest
```

将package.json中的test命令替换为：

```
"test": "vitest run --globals"
```

vitest支持`Chai`和`Jest`两种测试风格，其中`Chai`是默认启用的。

因为这里是做迁移，还是使用`Jest`测试风格，上述命令中的`run --globals`就是启用`Jest`测试风格。

我们只需要保留`@types/jest`依赖，并移除其它的Jest相关的依赖。