 # 常见问题
 
 ## Path of Typescript compiler option 'outDir' must be located inside Rollup 'dir' option
 
 `tsconfig.json`里面的`outDir`选项应当与`rollup.config.js`中单个`output`中的`dir`一致，或者位于后者的子目录。

 如：

 rollup.config.js
 
 ```js
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [typescript()]
};
```

而`tsconfig.json`中：

```json
"outDir": "dist"
```

## warning-treating-module-as-external-dependency

根据[官方文档](https://rollupjs.org/troubleshooting/#warning-treating-module-as-external-dependency)说明，有些模块被解析为外部模块。如果确实想编译为一个文件，需要使用`@rollup/plugin-node-resolve`插件。

## 如何minify？

`terser`是目前（2023）前端minify的主流解决方案，需要安装[@rollup/plugin-terser](https://www.npmjs.com/package/@rollup/plugin-terser)插件。