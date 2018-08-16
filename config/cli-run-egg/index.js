'use strict';
const getWebpackConfigBuilder = require('./lib/builder');
const WebpackClientBuilder = require('./lib/client-react');
const WebpackServerBuilder = require('./lib/server-react');
exports.getWebpackConfig = (config, option) => {
	return getWebpackConfigBuilder.getWebpackConfig(config, [WebpackClientBuilder, WebpackServerBuilder], option);
};
