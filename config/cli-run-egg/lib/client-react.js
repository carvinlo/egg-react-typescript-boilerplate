'use strict';
const ClientBuilder = require('./client');
const WebpackReactBaseBuilder = require('./base-react');
class WebpackClientBuilder extends WebpackReactBaseBuilder(ClientBuilder) {
	constructor(config = {}) {
		super(config);
	}

	createHotEntry() {
		if (this.hot) {
			super.createHotEntry();
			Object.keys(this.webpackConfig.entry).forEach(name => {
				this.webpackConfig.entry[name] = ['react-hot-loader/patch'].concat(this.webpackConfig.entry[name]);
			});
		}
	}
}
module.exports = WebpackClientBuilder;
