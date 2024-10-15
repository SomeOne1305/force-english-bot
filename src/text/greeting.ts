import createDebug from 'debug';
import { Context } from 'telegraf';

const debug = createDebug('bot:greeting_text');

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
  });

const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" text command');

  const messageId = ctx.message?.message_id;
  const userId = ctx.message?.from?.id;
  const userName = ctx.message?.from?.username
    ? `@${ctx.message?.from?.username}`
    : `<a href="tg://user?id=${userId}">${ctx.message?.from?.first_name} ${ctx.message?.from?.last_name || ''}</a>`.trim();

  if (messageId) {
    await replyToMessage(
      ctx,
      messageId,
      `Hello, ${userName}! This bot is powered by Kholmuminov. Thanks for Mark Pavlov for his boilerplate`,
    );
  }
};

export { greeting };
