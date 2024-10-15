import debug = require('debug');
import { existsSync } from 'fs';
import { join } from 'path';
import { Context } from 'telegraf';

const log = debug('bot:welcome');

// Function to send a welcome message with an audio file when a user joins the group

const sendWelcomeMessage = async (ctx: Context) => {
  // Check if the message contains new_chat_members
  if (ctx.message && 'new_chat_members' in ctx.message) {
    const newMembers = ctx.message.new_chat_members;

    const audioFilePath = join(process.cwd(), 'src', 'assets', 'welcome.wav');

    if (!existsSync(audioFilePath)) {
      log(`Audio file not found at path: ${audioFilePath}`);
      return;
    }

    try {
      // Loop through each new chat member and send a welcome message
      for (const member of newMembers) {
        const userId = member.id;
        const userName = member.username
          ? `@${member.username}`
          : `<a href="tg://user?id=${userId}">${member.first_name} ${member.last_name || ''}</a>`.trim();

        // Send the welcome audio file and message to the group
        await ctx.replyWithVoice(
          { source: audioFilePath },
          {
            caption: `Ayo ${userName}, welcome to the squad! By joinin' up, you’re sayin' you’ll only chat in English, ya feel me, fam?`,
            parse_mode: 'HTML',
          },
        );
      }
    } catch (error) {
      log('Failed to send welcome message:', error);
    }
  }
};
export { sendWelcomeMessage };
