# 背景介绍
有一个web个人项目，由两部分组成：

- ui 使用`vue-cli`创建，使用`vue`框架，使用`javascript`编写
- lib 使用`npm init`创建的npm包，使用`javascript`编写

在过去使用`npm init ${path}`，将本地的`lib`添加作为本地的`ui`的dependency pakcage。在构建`ui`时可以读取`lib`的最新改动，这给我带来了比较好的体验。

但是，随着项目重构，需要将`lib`切换为使用`typescript`编写，这属于我的知识盲区。

# 记录
在Google查了许多资料后，以及实际尝试，最终实现了helloworld，这里记录下来。

## 创建目录
创建目录（这里使用lib2指代pakcage，实际情况按需修改）：
```bash
mkdir lib2
cd lib2
```

## 初始化npm包
初始化npm包：
```json
npm init -y
```
*参数 `-y` 表示根据上下文，自动填充一些信息，如根据文件夹名称推测包名称*

此时，会生成一个`package.json`文件，它是npm的核心配置文件，内容大致为：
```json
{
  "name": "lib2",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## 安装typescript
本地安装typescript作为开发阶段依赖：
```bash
npm i typescript --save-dev
```

## 初始化typescript项目
初始化typescript项目：
```bash
npx tsc --init
```
此时，会生成一个`tsconfig.json`文件，它是typescript的唯一配置文件，内容大致为：
```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,                                      
    "skipLibCheck": true                                
  }
}
```
上面的`outDir`是我们唯一手动添加的参数，目的是将javascript生成结果单独保存。

## 编写入口文件
创建`src/index.ts`，并写入helloworld：
```typescript
export function helloworld() {
    console.log("hello world");
}
```

使用`tsc`编译包：
```bash
tsc
```

## 修改包配置文件
修改包配置文件：
```json
{
  "name": "exporter-of-exile-cn-translator",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build" : "tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript": "^4.6.4"
  }
}
```
我们添加了两个配置信息：

- `"main": "dist/index.js"`，指定包的入口文件
- `"build" : "tsc"`，映射执行`npm run build`时的实际指令

## 使用模式
相比于重构前，现有的使用模式增加了一个步骤：每次我们编辑完`lib2`项目后，需要使用`npm run build`来生成最终的`javascript`包，才能被`ui`项目使用。

这是因为，在当前架构下，`ui`项目对于`lib2`项目使用了`typescript`是无感知的，`ui`项目只依赖于`lib2`项目的构建结果。

# 总结
本文基于实际项目需求，记录了如何使用`typescript`来编写一个npm包，并作为其它由npm管理的javascript编写的web项目使用。

npm包，typescript，以及其它许多前端脚手架都是由`cli`驱动，由配置文件记录的使用模型，对文档和搜索引擎的依赖较大。

# Refs
[Step by step: Building and publishing an NPM Typescript package](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)