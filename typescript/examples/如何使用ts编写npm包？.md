# 目标

使用TypeScript编写库，可供TypeScript和JavaScript使用，并且上传到[npmjs](npmjs.com)中。

# 步骤

## 创建目录

创建目录（这里使用`my-package`表示包名，实际情况按需修改）：

```bash
mkdir my-package
cd my-package
```

## 初始化包

### npm/pnpm

初始化命令：

```bash
npm init -y
```

*参数 `-y` 表示根据上下文，自动填充一些信息，比如根据文件夹名称推测包名称*

此时，会生成一个`package.json`文件，它是npm的核心配置文件，内容大致为：

```json
{
  "name": "my-package",
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

### yarn

初始化命令：

```bash
yarn init -2
```

默认开启了pnp，建议[关闭](https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored)，同时在`.yarnrc.yml`中添加：

```
nodeLinker: node-modules
```

## 安装typescript

本地安装typescript作为开发阶段依赖：

```bash
# npm
npm i typescript --save-dev
# yarn
yarn add typescript -D
```

## 初始化typescript项目

初始化typescript项目：

```bash
# npm
npx tsc --init
# yarn
yarn tsc --init
```

此时，会生成一个`tsconfig.json`文件，它是typescript的唯一配置文件，内容大致为：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "ES6",
    "declaration": true,// 新增，生成typescript类型声明文件
    "outDir": "dist",// 新增，自定义编译输出目录
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,                                      
    "skipLibCheck": true                                
  },
  "include": ["src/**/*"]//新增，定义源文件
}
```

## 编写入口文件

创建`src/index.ts`，并写入helloworld：

```typescript
export function helloworld() {
    console.log("hello world");
}
```

## 修改包配置文件

修改包配置文件：

```json
{
  "name": "my-package",
  "version": "0.0.1",
  "description": "",
  "main": "dist/index.js",//修改，指定包的入口文件
  "types": "dist/index.d.ts",//新增，供typescript使用的类型文件
  "scripts": {
    "build" : "tsc"//新增，映射执行`npm run build`时的实际指令
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript": "^4.6.4"
  },
  "files": ["dist/**/*"]//指定包所包含的文件
}
```

实际项目不会使用`tsc`而是使用`rollup`之类的构建工具，这是因为前端项目往往面临众多兼容性问题。

## 发布

```
npm run build #先编译再发布
npm login #只需要执行一次，后续会在本机保留登陆信息
npm publish
```

# 优化

上面步骤包含了最基本的流程，但是在真实项目中，我们还需要更多的东西，如：

- eslint，检查代码，个人认为其在typescript项目中的意义不大
- prettier，格式化代码
- jest，最流行的js/ts测试框架，但目前对esm的支持不够完善，vitest是jest在esm时代的替代品
- rollup，自定义构建
- esm，js模块官方解决方案

这些工具的用途、使用参考相应的笔记。

这里有我目前使用的完整项目模板：[ts-module-template](https://github.com/me1ting/ts-module-template)
