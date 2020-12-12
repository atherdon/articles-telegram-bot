import { Telegraf } from 'telegraf';
import { Filters } from './filters/filters';
import { Users } from './users/users';
import * as path from 'path';
import { Menu } from './buttons';
import { TelegrafContext } from 'telegraf/typings/context';
import { FilterToggleReply, FiltersReply } from './utils/type.check';

const filters = new Filters(path.join(__dirname, '..', 'db', 'filters.json'));
const users = new Users(path.join(__dirname, '..', 'db', 'users.sqlite3'));
const bot = new Telegraf('1444702700:AAFS3hUzWh7ZQDcOP7V3ZuRGMUxpGq5dNCs');

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

bot.action('filters', FiltersReply);
bot.command('filters', FiltersReply);

bot.action(/(filter)-([0-9]{1,3})/i, FilterToggleReply);

bot.command('benchmark', async (ctx: TelegrafContext) => {
  const start = +new Date();
  await ctx.reply('Wait...');
  await ctx.reply(`Response time: ${+new Date() - start} ms`);
  console.log('Response time: %s ms', +new Date() - start);
});

bot.on('text', async (ctx: TelegrafContext) => {
  if (
    typeof ctx.update !== 'undefined' &&
    typeof ctx.update.message !== 'undefined' &&
    typeof ctx.update.message.text !== 'undefined'
  ) {
    const msg: string = ctx.update.message.text;
    await ctx.reply(msg);
  }
});

bot.launch().then(async () => {
  await filters.start();
  console.log('Bot started successfully');
});
