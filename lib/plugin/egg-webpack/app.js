'use strict';
const path = require('path');
const fs = require('fs');
const proxy = require('./lib/proxy');
const Constant = require('./lib/constant');

/* egg-webpack-react */
// const path = require('path');
const co = require('co');
const vm = require('vm');
const NativeModule = require('module');

module.exports = app => {
	// 编译状态展示页面
	app.use(function*(next) {
		if (app.webpack_build_success) {
			yield* next;
		} else {
			const filePath = path.resolve(__dirname, './lib/template/loading.html');
			this.body = app.webpack_loading_text = fs.readFileSync(filePath, 'utf8');
		}
	});
	const config = app.config.webpack;

	// 设置webpack编译静态资源代理
	app.use(proxy(config.proxy));
	// 最大监听数
	app.messenger.setMaxListeners(config.maxListeners || 10000);

	app.messenger.on(Constant.WEBPACK_BUILD_STATE, data => {
		app.webpack_build_success = data.state;
	});
	app.ready(() => {
		app.messenger.sendToAgent(Constant.WEBPACK_BUILD_STATE);
	});

	/* egg-webpack-react */
	if (app.view) {
		app.view.resolve = function(name) {
			return Promise.resolve(name);
		};
	}

	let _filePath, _resolve;
	app.messenger.on(Constant.WEBPACK_READ_FILE_MEMORY_CONTENT, data => {
		if (_filePath === data.filePath) {
			_resolve(data.fileContent);
		}
	});
	const readWebpackMemoryFile = (filePath, fileName, target = 'node') => {
		_filePath = filePath;
		return new Promise(resolve => {
			_resolve = resolve;
			app.messenger.sendToAgent(Constant.WEBPACK_READ_FILE_MEMORY, {
				filePath,
				fileName,
				target
			});
		});
	};

	if (app.react) {
		app.react.render = (name, locals, options) => {
			const filePath = path.isAbsolute(name) ? name : path.join(app.config.view.root[0], name);
			return co(function*() {
				const code = yield readWebpackMemoryFile(filePath, name);
				if (!code) {
					throw new Error(
						`read webpack memory file[${filePath}] content is empty, please check if the file exists`
					);
				}
				const wrapper = NativeModule.wrap(code);
				vm.runInThisContext(wrapper)(exports, require, module, __filename, __dirname);
				const reactClass =
					module.exports && module.exports.default
						? module.exports
						: exports.default
							? exports
							: module.exports;
				if (options && options.markup) {
					return app.react.renderToStaticMarkup(reactClass, locals);
				}
				return app.react.renderElement(reactClass, locals);
			});
		};
	}
};
