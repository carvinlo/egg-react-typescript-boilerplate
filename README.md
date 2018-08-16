# egg-react-typescript-boilerplate

fork from [egg-react-typescript-boilerplate](https://github.com/hubcarl/egg-react-typescript-boilerplate)

## 环境

-   Egg 版本： ^2.x.x
-   Node 版本: Node ^8.x.x+,
-   Webpack 版本: ^4.x.x
-   React 版本: ^16.0.0
-   TypeScript: ^2.6.2

## 特性

-   支持 Egg Node 端代码 和 前端代码 TypeScript 编写和构建

-   支持 async 和 await 特性, Controller 采用 class 方式编写

-   支持 server 和 client 端代码修改, Webpack 时时编译和热更新, `npm run dev` 一键启动应用

-   基于 react + react-router + react-redux 单页面服务器客户端同构实现

-   支持开发环境, 测试环境，正式环境 Webpack 编译

-   支持 js/css/image 资源依赖, 内置支持 CDN 特性

-   支持 Webpack DLL 自动化构建

## 本地启动应用

> 启动前 `npm run clean` 清除 ts 编译的 js 文件。

调试面板启动项目

## 构建文件

-   TypeScript Egg 构建

```bash
npm run tsc
```

-   TypeScript 前端工程构建

```bash
node builder.js
```

## 打包部署

1. 先运行 `npm run tsc` 和 `npm run build` 构建 TypeScript Egg 代码和 TypeScript 前端代码
2. 项目代码和构建代码一起打包代码
3. 应用部署后，通过 `npm start` 启动应用

## License

[MIT](LICENSE)
