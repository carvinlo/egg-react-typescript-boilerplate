'use strict';
import { Controller } from 'egg';
export default class HelloController extends Controller {
	public async element() {
		const { ctx } = this;
		await ctx.render('hello/element.js', {
			title: '--react server side render--',
			keywords: 'react, server side render',
			message: { text: 'react server side render for element!' }
		});
	}

	public async component() {
		const { ctx } = this;
		await ctx.render('hello/component.js', {
			title: '--react server side render--',
			keywords: 'react, server side render',
			message: { text: 'react server side render for component!' }
		});
	}
}
