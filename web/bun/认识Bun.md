# 认识Bun

[Bun](https://bun.sh/)简单来说是Node.js的替代品，即一个JavaScript运行时，并吸收了包管理器(npm,pnpm,yarn...)，转译器(tsc...)，打包器(rollup,esbuild...)，测试(jest,vitest...)相关功能，官网号称`All in One`。

Bun是基于Apple的`JavaScriptCore`虚拟机，而非Google的V8虚拟机。

可以看到Bun包含了复杂的功能，但目前想用Bun完全取代Node.js以及相关工具链，从合作项目来讲是不现实的。

但正如`pnpm`对于`npm`的渐进式取代，个人对于将`Bun`融入到个人项目的工具链中感兴趣。
## 取代TSnode

Node.js 原生并不支持TS，需要使用一个第三方（非Node.js团队也非TS团队开发的）开源项目[TSnode](https://github.com/TypeStrong/ts-node)，来实现执行TS脚本。

而该项目一方面需要独立安装，一方面也事实上陷入了停滞。因此使用 Bun来取代TSnode是很不错的选择：

```
bun main.ts
```

## 改进测试

在我实际开发中遇到一个[案例](https://github.com/cn-poe-community/pob-building-creator/commit/f683eed53e8f5279fa49ee94baefb604727c5157)，一段存在BUG的代码，在V8下表现正常，但是在QuickJS 环境下运行却存在异常。使用基于`JavaScriptCore`的Bun做二次测试可能会改善这种情况。

Bun兼容Jest框架，实际表明，其测试速度很快。
