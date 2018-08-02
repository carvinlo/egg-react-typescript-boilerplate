'use strict';
import { Controller } from 'egg';
export default class CssModuleController extends Controller {
  public async cssModule() {
    const { ctx } = this;
    await ctx.render('css/module/module.js', {
      title: '--react server side render--',
      keywords: 'react, server side render',
      message: { text: 'react server side render! support css module test!' }
    });
  }
};