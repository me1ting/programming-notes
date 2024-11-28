# React的一些脚手架

## Next.js

[Next.js](https://nextjs.org/) 是基于 React 的一个Web应用脚手架，其特色是：

- SSR，提供服务端渲染功能
- 全栈，提供轻量的服务层和数据访问层
- 与 Vercel 高度集成

Vercel 是美国的一家云服务公司。简单来说，Next.js 就是 Vercel 用于推广自家云服务而开发的一款开源产品。

由于Vercel对于React项目进行了较多的资源投入，因此两者Next.js和React项目关系密切，而Next.js也被React官方推荐为首选脚手架。

### 适合的场景

如果你需要使用React开发前端应用，存在以下需求，那么Next.js很适合：

- 需要SSR
- 需要使用 Vercel 服务
- 需要基于JavaScript的全栈

> 基于 JavaScript 的全栈在创业公司使用较多，特别是国外的一些创业公司。

## T3 App

[T3 App](https://github.com/t3-oss/create-t3-app)是基于Next.js的一个Web全栈项目脚手架。

### 适合的场景

当你需要使用React开发基于JavaScript的全栈项目时，可以使用该脚手架。

## Vite

Vite 是 Vue 项目组开发的用于 Vue 的官方脚手架，由于存在竞争关系，Vite并没有得到React官方的欣赏。但由于Vue和React在定位上的类似，Vite对于React的理解是到位的。

### 适合的场景

由于`create-react-app`太过老旧，而`Next.js`专注于全栈，因此对于 SPA 应用而言，Vite 是目前最合适的选择。

## create-react-app

React官方的弃子，现已不建议使用。
