import * as path from 'path';
export default {
	cors: {
		package: 'egg-cors'
	},
	webpack: {
		path: path.join(__dirname, '../lib/plugin/egg-webpack')
	}
};
