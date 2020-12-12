import { TelegrafContext } from 'telegraf/typings/context';
import { Filter } from '../filters/filter.type';
import { Users } from '../users/users';
import { Filters } from '../filters/filters';
import path from 'path';
import { CallbackButton } from 'telegraf/typings/markup';
import * as _ from 'lodash';
import { Markup } from 'telegraf';
import { Menu } from '../buttons';

const filters = new Filters(path.join(__dirname, '..', '..', 'db', 'filters.json'));
const users = new Users(path.join(__dirname, '..', '..', 'db', 'users.sqlite3'));

export const FiltersReply = async (ctx: TelegrafContext): Promise<void> => {
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
  });
  const keyboard = Markup.inlineKeyboard(btns);

  console.log(keyboard, Menu);
  await ctx.reply('Можете подписаться на эти фильтры', {
    reply_markup: keyboard
  });
};

export const FilterToggleReply = async (
  ctx: TelegrafContext
): Promise<void> => {
  if (
    typeof ctx.match !== 'undefined' &&
    ctx.match !== null &&
    typeof ctx.update !== 'undefined' &&
    typeof ctx.update.callback_query !== 'undefined'
  ) {
    const fid: number = +ctx.match[2];
    const id = ctx.update.callback_query.from.id;
    const user = await users.getUser(id);
    filters
      .getFilter(fid)
      .then(async () => {
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
    await ctx.reply('Error');
  }
};
