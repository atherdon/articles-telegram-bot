import { Telegraf, Markup } from 'telegraf';
import { Filters } from './filters/filters';
import { Users } from './users/users';
import * as path from 'path';
import { Menu } from './buttons';
import { CallbackButton } from 'telegraf/typings/markup';
import { Filter } from './filters/filter.type';

const filters = new Filters(path.join(__dirname, '..', 'db', 'filters.json'));
const users = new Users(path.join(__dirname, '..', 'db', 'users.sqlite3'));
const bot = new Telegraf('1444702700:AAFS3hUzWh7ZQDcOP7V3ZuRGMUxpGq5dNCs');

// bot.use(Telegraf.log())

bot.start(async (ctx) => {
  const user = ctx.update.message?.from;
  if (typeof user !== 'undefined') {
    await users.create({
      uid: user.id,
      filters: ''
    });
    //@ts-ignore
    return ctx.reply('Custom buttons keyboard', {
      reply_markup: Menu
    });
  } else {
    ctx.reply('Мы не смогли определить вас.');
  }
});

bot.action('filters', async (ctx) => {
  const current_filters = await filters.data();
  const btns: Array<CallbackButton[]> = [];
  let counter = 0;
  for (let filter of current_filters) {
    if (counter % 3 == 0) {
      btns.push([]);
    }
    btns[Math.floor(counter / 3)].push(
      Markup.callbackButton(filter.name, 'filter-' + filter.id)
    );
    counter++;
  }
  const keyboard = Markup.inlineKeyboard(btns);

  console.log(keyboard, Menu);
  await ctx.reply('Можете подписаться на эти фильтры', {
    reply_markup: keyboard
  });
});

bot.action(/(filter)-([0-9]{1,3})/i, async (ctx) => {
  // @ts-ignore
  if (typeof ctx.match !== 'undefined' && ctx.match !== null) {
    const fid: number = +ctx.match[2];
    // @ts-ignore
    const id = ctx.update.callback_query.from.id;
    const user = await users.getUser(id);
    filters
      .getFilter(fid)
      .then(async (filter) => {
        let { filters } = user;
        if (filters.indexOf(String(fid)) === -1) {
          if (typeof filters !== 'string') {
            filters.push(String(fid));
          } else {
            filters = filters.split(',');
            filters.push(String(fid));
          }
        } else {
          if (typeof filters !== 'string') {
            await filters.splice(filters.indexOf(String(fid)), 1);
          } else {
            filters = filters.split(',');
            await filters.splice(filters.indexOf(String(fid)), 1);
          }
        }
        user.filters = filters;
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

bot.command('benchmark', async (ctx) => {
  const start = +new Date();
  await ctx.reply('Wait...');
  await ctx.reply(`Response time: ${+new Date() - start} ms`);
  console.log('Response time: %s ms', +new Date() - start);
});

bot.on('text', (ctx) => {
  // @ts-ignore
  const msg: string = ctx.update.message.text;
  ctx.reply(msg);
});

bot.command('filters', (ctx) => {});

bot.launch().then(async () => {
  await filters.start();
  console.log('Bot started successfully');
});
