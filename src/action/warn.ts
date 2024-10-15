import debug = require('debug');
import { existsSync } from 'fs';
import { join } from 'path';
import { Context } from 'telegraf';

const log = debug('bot:warning');

function isTextInEnglish(text: string): boolean {
  const englishWords = require('an-array-of-english-words');
  const englishWordSet = new Set(englishWords);

  // Clean and split the text into words
  const words = text
    .toLowerCase()
    .replace(/[.,!?'"()-]/g, '') // Remove punctuation
    .split(/\s+/); // Split by spaces

  // Count unknown words
  let unknownWordCount = 0;

  for (const word of words) {
    if (!englishWordSet.has(word) && word.trim() !== '') {
      // Ignore empty strings
      unknownWordCount++;
    }
    if (unknownWordCount > 3) {
      return false; // More than 3 unknown words, return false
    }
  }

  return true; // Return true if unknown words are 3 or fewer
}

// Function to send a warning with an audio file
const warning = () => async (ctx: Context) => {
  if (
    ctx.message?.chat.type === 'group' ||
    ctx.message?.chat.type === 'supergroup'
  ) {
    const userId = ctx.message?.from.id;
    // Use the username if available, otherwise default to "man"
    const userName = ctx.message?.from.username
      ? `@${ctx.message?.from.username}`
      : 'man';

    // Construct the absolute path to the audio file
    const audioFilePath = join(
      process.cwd(),
      'src',
      'assets',
      'audio-warning.wav',
    );

    // Check if the audio file exists
    if (!existsSync(audioFilePath)) {
      log(`Audio file not found at path: ${audioFilePath}`);
      return;
    }

    // Ensure the message has a text property
    if ('text' in ctx.message && ctx.message.text) {
      if (!isTextInEnglish(ctx.message.text)) {
        try {
          // Send the audio file with a caption, mentioning the user
          await ctx.replyWithVoice(
            { source: audioFilePath },
            {
              caption: `A yo <a href="tg://user?id=${userId}">${userName}</a>, we agreed, no cap! Keep it in English, feel me? Gotta vibe right, so let’s keep it lit! 🔥✌️`,
              parse_mode: 'HTML', // Enable HTML to use the <a> tag for mentioning
            },
          );
        } catch (error) {
          log('Failed to send warning:', error);
        }
      }
    }
  }
};

export { warning };
