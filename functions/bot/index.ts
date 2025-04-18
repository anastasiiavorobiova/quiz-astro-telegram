/* eslint-disable */
import { Telegraf } from "telegraf";
// import { BOT_TOKEN, APP_URL } from "./config";
import type { Handler } from "@netlify/functions";

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const APP_URL = process.env.APP_URL || "";

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
    console.log("Web app error", err);
  }
});

// bot.launch().then(() => {
//   console.log("Bot is running...");
// });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export const handler: Handler = async (event) => {
  try {
    console.log(event.body);
    const body = event.body || "";

    await bot.handleUpdate(JSON.parse(body));

    return { statusCode: 200, body: "" };
  } catch (e) {
    console.error("error in handler:", e);

    return {
      statusCode: 400,
      body: "This endpoint is meant for bot and telegram communication",
    };
  }
};
