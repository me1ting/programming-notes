# 在vscode中debug js和ts代码

vscode对于ts/js进行了原生集成，想要对js和ts代码进行调试，只需要开启`JavaScript Debug Terminal`：

![](_images/Pasted%20image%2020240124012835.png)

通过该Terminal执行的任意Node.js进程就会自动进入debug模式。个人测试，包括：

- 直接执行命令`node xxx.js`
- 执行测试命令`pnpm test`（基于vitest,jest等）

## 参考资料

[doc: vitest debug](https://vitest.dev/guide/debugging#vs-code)