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
yarn add --dev jest
yarn add --dev ts-jest
yarn add --dev @jest/globals
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
一般情况下，typescript项目的组织结构为：
- src 存储源码
- test 存储测试代码

在测试文件夹中，创建与被测试文件相同路径下的相似名称的文件，以`.test.ts`作为后缀：
```
src/service/demo.service.ts //被测试文件
test/service/demo.service.test.ts //测试文件
```

个人习惯采取如下的风格来组织测试代码：
```ts
import { BaseTypeProvider } from "../../src/provider/basetype.provider";
import { BaseTypeService } from "../../src/service/basetype.service";


let provider = new BaseTypeProvider();
let service = new BaseTypeService(provider);

function testTranslateBaseType() {
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
}

function testTranslateTypeLine() {
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
}

testTranslateBaseType();
testTranslateTypeLine();
```

## 测试命令
在前面，我们将`npm test`映射到`jest`，执行`npm test`等价于执行`jest`，后续表述中将使用`npm test`而非`jest`。
>只有初次安装jest才自动将`jest`添加到当前命令行path，后续想要直接执行`jest`需要手动设置path，或者全局安装jest。

`npm test`会执行所有测试用例。

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
