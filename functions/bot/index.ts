/* eslint-disable */
import { Telegraf } from "telegraf";
// import { BOT_TOKEN, APP_URL } from "./config";
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const APP_URL = process.env.APP_URL || "";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(BOT_TOKEN);

// Basic commands
bot.command("start", (ctx: any) => {
  ctx.reply(
    "Welcome to AstroAppQuizBot! 🚀\nUse /help to see available commands.",
  );
});

bot.command("help", (ctx: any) => {
  ctx.reply(
    "Available commands:\n" +
      "/start - Start the bot\n" +
      "/help - Show this help message\n" +
      "/webapp - Open the Mini App",
  );
});

bot.command("webapp", (ctx: any) => {
  ctx.reply("Open Web App", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Open App", web_app: { url: APP_URL || "" } }],
      ],
    },
  });
});

bot.launch().then(() => {
  console.log("Bot is running...");
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
