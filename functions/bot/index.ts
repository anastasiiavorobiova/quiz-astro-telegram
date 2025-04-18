/* eslint-disable */
import { Telegraf } from "telegraf";
import { BOT_TOKEN, APP_URL } from "./config";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(BOT_TOKEN);

// Basic commands
bot.command("start", (ctx: any) => {
  try {
    ctx.reply(
      "Welcome to AstroAppQuizBot! 🚀\nUse /help to see available commands.",
    );
  } catch (err) {
    ctx.reply("Start error");
    console.log("Start error", err);
  }
});

bot.command("help", (ctx: any) => {
  try {
    ctx.reply(
      "Available commands:\n" +
        "/start - Start the bot\n" +
        "/help - Show this help message\n" +
        "/webapp - Open the Mini App",
    );
  } catch (err) {
    ctx.reply("Help error");
    console.log("Help error", err);
  }
});

bot.command("webapp", (ctx: any) => {
  try {
    ctx.reply("Open Web App", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Open App", web_app: { url: APP_URL || "" } }],
        ],
      },
    });
  } catch (err) {
    ctx.reply("Web app error");
    console.log("Web app error", err);
  }
});

bot.launch().then(() => {
  console.log("Bot is running...");
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
