import { Markup } from 'telegraf';
const { callbackButton } = Markup;

export const Menu = Markup.inlineKeyboard([
  callbackButton('Filters', 'filters')
])
  .resize()
  .oneTime();
