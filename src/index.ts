import { Telegraf } from "telegraf";
import { Filters } from "./filters/filters";
import * as path from "path";

const filters = new Filters(path.join(__dirname, "..", "db", "filters.json"));

const bot = new Telegraf("input token here");
bot.start(({ reply }) => {
  reply("Hello");
});
bot.command("benchmark", async (ctx) => {
  const start = +new Date();
  await ctx.reply("Wait...");
  await ctx.reply(`Response time: ${+new Date() - start} ms`);
  console.log("Response time: %s ms", +new Date() - start);
});
bot.on("text", (ctx) => {
  // @ts-ignore
  const msg: string = ctx.update.message.text;
  ctx.reply(msg);
});

bot.command("filters", ({ reply }) => {
  reply("Some filters");
});
bot.launch();
