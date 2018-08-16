'use strict';
const ServerBuilder = require('./server');
const WebpackReactBaseBuilder = require('./base-react');
class WebpackServerBuilder extends WebpackReactBaseBuilder(ServerBuilder) {
	constructor(config) {
		super(config);
		this.setStyleLoader('isomorphic-style-loader');
	}
}
module.exports = WebpackServerBuilder;
