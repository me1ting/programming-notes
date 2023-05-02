# 简介
本文介绍如何给一个typescript项目添加单元测试。

# jest
## 安装
在Google的帮助下，我选择了[jest](https://jestjs.io/)这款测试框架。

首先需要安装jest，以及jest对typescript的相关支持：
```bash
#npm
npm install --save-dev jest
npm install --save-dev ts-jest
npm install --save-dev @types/jest

# yarn
yarn add --dev jest ts-jest @types/jest
```

>注意，除了jest其余支持都有相关的替代选项，具体细节参考[文档](https://jestjs.io/docs/getting-started)。

## 初始化
使用`cli`进行初始化：
```bash
# npm
jest --init

# yarn
yarn jest --init
```
根据提示进行选择，选项都很简单，不懂就保持默认。

检查生成的配置文件`jest.config.js`，保证如下参数存在：
```
preset: 'ts-jest',
```
否则后续测试过程会出错。

检查`package.json`，应当有如下参数（指`"test": "jest"`），如果没有手动添加：
```
  "scripts": {
    "test": "jest",
    //...
  },
```

这个参数保证我们可以通过`npm run test`/`npm test`来执行测试命令。

## 单元测试
默认情况下,jest将`**/__tests__/**`下的文件当作测试文件，测试文件一般以`.test.ts`作为后缀。

个人习惯采取如下的风格来组织测试代码：
```ts
import { BaseTypeProvider } from "../../src/provider/basetype.provider";
import { BaseTypeService } from "../../src/service/basetype.service";


let provider = new BaseTypeProvider();
let service = new BaseTypeService(provider);

(function testTranslateBaseType() {
    let testcases = [
        { "zh": "刚玉药剂", "en": "Corundum Flask" }
    ]

    for (let t of testcases) {
        let zh = t["zh"];
        let en = t["en"];


        test(`translate basetype: ${zh} to ${en}`, () => {
            expect(service.translateBaseType(zh)).toBe(en);
        });
    }
})();

(function testTranslateTypeLine() {
    let testcases = [
        { "zh": "嗜血的永恒之剑", "en": "Eternal Sword" }
    ]

    for (let t of testcases) {
        let zh = t["zh"];
        let en = t["en"];


        test(`translate basetype: ${zh} to ${en}`, () => {
            expect(service.translateTypeLine(zh)).toBe(en);
        });
    }
})();
```

## 测试命令
在前面，我们将`npm test`映射到`jest`，执行`npm test`就可以进行测试。

如果我们想要只测试特定文件，可以将文件名/glob模式添加到测试命令后面：
```
npm test a.test.ts
npm test service/*
```


# 总结
本文记录了在typescript中使用`jest`进行单元测试的第一步，更多使用技巧有待进一步了解。

# refs

[document: get started with typescript](https://jestjs.io/docs/getting-started#using-typescript)

[personal blog: How to Test TypeScript with Jest](https://medium.com/nerd-for-tech/testing-typescript-with-jest-290eaee9479d)
