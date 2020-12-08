import { Telegraf, Markup } from 'telegraf';
import { Filters } from './filters/filters';
import { Users } from './users/users';
import * as path from 'path';
import { Menu } from './buttons';
import { CallbackButton } from 'telegraf/typings/markup';
import { TelegrafContext } from 'telegraf/typings/context'
import { Filter } from './filters/filter.type';
import * as _ from 'lodash';

const filters = new Filters(path.join(__dirname, '..', 'db', 'filters.json'));
const users = new Users(path.join(__dirname, '..', 'db', 'users.sqlite3'));
const bot = new Telegraf('1444702700:AAFS3hUzWh7ZQDcOP7V3ZuRGMUxpGq5dNCs');

// bot.use(Telegraf.log())

bot.start(async (ctx: TelegrafContext) => {
  const user = ctx.update.message?.from;
  if (typeof user !== 'undefined') {
    await users.create({
      uid: user.id,
      filters: ''
    });
    return ctx.reply('Custom buttons keyboard', {
      reply_markup: Menu
    });
  } else {
    await ctx.reply('Мы не смогли определить вас.');
  }
});

bot.action('filters', async (ctx: TelegrafContext) => {
  const current_filters = await filters.data();
  const btns: Array<CallbackButton[]> = [];
  _.forEach(current_filters, (filter: Filter) => {
    if (typeof filter.id !== 'undefined') {
      const id = filter.id - 1;
      if (id % 3 == 0) {
        btns.push([]);
      }
      console.log(id);
      btns[_.floor(id / 3)].push(
        Markup.callbackButton(filter.name, 'filter-' + filter.id)
      );
    }
  })
  const keyboard = Markup.inlineKeyboard(btns);

  console.log(keyboard, Menu);
  await ctx.reply('Можете подписаться на эти фильтры', {
    reply_markup: keyboard
  });
});

bot.action(/(filter)-([0-9]{1,3})/i, async (ctx) => {
  if (typeof ctx.match !== 'undefined' && ctx.match !== null && typeof ctx.update !== 'undefined' && typeof ctx.update.callback_query !== 'undefined') {
    const fid: number = +ctx.match[2];
    const id = ctx.update.callback_query.from.id;
    const user = await users.getUser(id);
    filters
      .getFilter(fid)
      .then(async (filter) => {
        let current_filters = user.filters;
        current_filters = await filters.correctFilter(current_filters, fid);
        user.filters = current_filters;
        await users.update(user);
        await ctx.reply('Your filters - ' + JSON.stringify(user.filters));
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    return ctx.reply('Error');
  }
});

bot.command('benchmark', async (ctx: TelegrafContext) => {
  const start = +new Date();
  await ctx.reply('Wait...');
  await ctx.reply(`Response time: ${+new Date() - start} ms`);
  console.log('Response time: %s ms', +new Date() - start);
});

bot.on('text', async (ctx: TelegrafContext) => {
  if (typeof ctx.update !== 'undefined' && typeof ctx.update.message !== 'undefined' && typeof ctx.update.message.text !== 'undefined' ) {
    const msg: string = ctx.update.message.text;
    await ctx.reply(msg);
  }
});

bot.command('filters', (ctx: TelegrafContext) => {});

bot.launch().then(async () => {
  await filters.start();
  console.log('Bot started successfully');
});
