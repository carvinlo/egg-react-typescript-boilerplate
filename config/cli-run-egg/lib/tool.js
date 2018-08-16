'use strict';
const webpack = require('webpack');
const merge = require('webpack-merge');
const koa = require('koa');
const serve = require('koa-static');
const cors = require('kcors');
const open = require('opn');
const chalk = require('chalk');
const proxy = require('koa-proxy');
const utils = require('./utils');
class WebpackTool {
	constructor(config) {
		this.config = merge(
			{
				port: 9000,
				debugPort: 8888,
				hot: false
			},
			config
		);
	}

	build(webpackConfig, option, callback) {
		if (typeof option === 'function') {
			callback = option;
		}
		const webpackConfigList = Array.isArray(webpackConfig) ? webpackConfig : [webpackConfig];
		const compiler = this.config.isServerBuild
			? webpack(webpackConfigList)
			: webpack(webpackConfigList, (err, compilation) => {
					if (err) {
						throw err;
					}
			  });
		compiler.hooks.done.tap('webpack-tool-build-done', compilation => {
			callback && callback(compiler, compilation);
			compilation.stats.forEach((stat, index) => {
				const webpackConfigItem = stat.compilation.options;
				// 开发模式，css inline以支持hmr
				if (!this.config.isServerBuild) {
					// show build result in cmd window
					stat.compilation.children = stat.compilation.children.filter(child => {
						return child.name !== 'extract-text-webpack-plugin' && !/html-webpack-plugin/.test(child.name);
					});
					process.stdout.write(
						`${stat.toString(
							merge(
								{
									colors: true,
									modules: false,
									children: false,
									chunks: false,
									chunkModules: false,
									entrypoints: false
								},
								webpackConfigItem.stats
							)
						)}\n`
					);
				}
			});
		});
		return compiler;
	}

	createWebpackServer(compiler, config, webpackConfigItem = {}) {
		const target = config.target;
		const port = config.port;
		const hot = config.hot;
		const publicPath = config.publicPath;
		const proxyInfo = config.proxy || this.config.proxy;
		const app = koa();
		app.use(cors());
		if (typeof proxyInfo === 'object') {
			// 支持多个域名代理
			const proxyList = Array.isArray(proxyInfo) ? proxyInfo : [proxyInfo];
			proxyList.forEach(item => {
				app.use(
					proxy(
						merge(
							{
								jar: true,
								yieldNext: true
							},
							item
						)
					)
				);
			});
		}
		if (compiler) {
			const devOptions = merge(
				{
					publicPath,
					stats: {
						colors: true,
						children: true,
						modules: false,
						chunks: false,
						chunkModules: false,
						entrypoints: false
					},
					headers: {
						'cache-control': 'max-age=0'
					},
					watchOptions: {
						ignored: /node_modules/
					}
				},
				{ stats: webpackConfigItem.stats, watchOptions: webpackConfigItem.watchOptions }
			);
			const devMiddleware = require('./dev')(compiler, devOptions);
			app.use(devMiddleware);

			if (hot === undefined || hot) {
				const hotMiddleware = require('koa-webpack-hot-middleware')(compiler, {
					log: false,
					reload: true
				});
				app.use(hotMiddleware);
			}
		} else {
			app.use(serve(process.cwd()));
		}

		app.listen(port, err => {
			if (!err && compiler) {
				const ip = utils.getIp();
				const url = `http://${ip}:${port}`;
				if (target) {
					console.info(chalk.green(`\r\n [webpack-tool] start webpack ${target} building server: ${url}`));
				} else {
					console.info(chalk.green(`\r\n [webpack-tool] start webpack building server: ${url}`));
				}
			}
		});
	}

	openBrowser(port, url) {
		if (!url) {
			const ip = utils.getIp();
			url = `http://${ip}:${port}`;
		}
		open(url);
	}
}

module.exports = WebpackTool;
