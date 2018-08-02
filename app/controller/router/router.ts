import { Controller } from 'egg';
export default class RouterController extends Controller {
  public async index() {
    const { ctx } = this;
    await ctx.render('router/router.js', { message: 'react server side render!' });
  }
}