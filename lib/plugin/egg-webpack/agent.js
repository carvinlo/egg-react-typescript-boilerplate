'use strict';
const MultProcessWebpackServer = require('./lib/mult-process-server');

/* egg-webpack-react */
const fs = require('fs');

module.exports = agent => {
	agent.messenger.on('egg-ready', () => {
		const config = agent.config.webpack;
		agent.messenger.setMaxListeners(config.maxListeners || 10000);
		new MultProcessWebpackServer(agent, {}).start();
	});

	/* egg-webpack-react */
	// 开发模式删除历史manifest
	agent.ready(() => {
		const manifest = agent.config.reactssr.manifest;
		try {
			if (fs.existsSync(manifest)) {
				fs.unlinkSync(manifest);
			}
		} catch (e) {}
	});
};
