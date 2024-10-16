import { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { sendWelcomeMessage, warning } from './action';
import { about } from './commands';
import { development, production } from './core';
import { greeting } from './text';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);
bot.on(message('new_chat_members'), sendWelcomeMessage);

bot.command('about', about());
bot.command('start', greeting());
bot.on(message('text'), warning());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
