'use strict';
const path = require('path');
const merge = require('webpack-merge');
const baseDir = process.cwd();

exports.getWebpackConfig = (config, builders, option = {}) => {
	const filepath = path.join(baseDir, 'webpack.config.js');
	const builderConfig = merge({ baseDir }, require(filepath), config);
	let webpackConfigList = [];

	builders.forEach(WebpackBuilder => {
		// console.log('easywebpack.getWebpackConfig:',WebpackBuilder.TYPE, WebpackBuilder.TARGET, target, type);
		if (option.target === undefined || WebpackBuilder.TARGET === option.target) {
			webpackConfigList.push(new WebpackBuilder(builderConfig).create());
		}
	});
	return webpackConfigList.length === 1 ? webpackConfigList[0] : webpackConfigList;
};
