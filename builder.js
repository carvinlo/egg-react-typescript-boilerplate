'use strict';
const WebpackTool = require('./config/cli-run-egg/lib/tool');
const webpackConfigBuilder = require('./config/cli-run-egg');

const webpackTool = new WebpackTool();
const webpackConfig = webpackConfigBuilder.getWebpackConfig(
	{
		cli: true,
		env: 'prod'
	},
	{}
);
webpackTool.build(webpackConfig, {}, () => {
	console.log('---webpack compile finish---');
});
