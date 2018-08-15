'use strict';
const WebpackTool = require('webpack-tool');
const easywebpackReact = require('easywebpack-react');
const utils = require('./utils');
let compiler;
let webpackTool;

process.on('message', m => {
	if (m.action === 'building') {
		const config = m.config;
		const option = m.option;
		const webpackToolConfig = { isServerBuild: true, port: config.port };
		let webpackConfig = easywebpackReact.getWebpackConfig(config, option);

		webpackTool = new WebpackTool(webpackToolConfig);
		compiler = webpackTool.build(webpackConfig, () => {
			process.send({ action: 'done' });
		});
		webpackTool.createWebpackServer(
			compiler,
			{
				hot: webpackConfig.target !== 'node',
				target: webpackConfig.target,
				port: webpackTool.config.port + option.index,
				publicPath: webpackConfig.output.publicPath
			},
			webpackConfig
		);
	} else if (m.action === 'file') {
		const filePath = m.filePath;
		const fileContent = utils.readWebpackMemoryFile([compiler], filePath);
		process.send({ action: 'file', fileContent, filePath });
	} else if (m.action === 'done') {
		webpackTool.openBrowser(m.appPort, m.browser);
	}
});
// 使用Control+C键，可以触发SIGINT信号
process.on('SIGINT', () => {
	process.exit(0);
});
process.on('SIGTERM', () => {
	process.exit(0);
});
