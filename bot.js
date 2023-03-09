const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

const token = '5670788120:AAFwJWE8_xJwbDAdxW7BtBGKl0hSjhT_qZY';
const bot = new TelegramBot(token, { polling: true });

// Set up the webhook
bot.setWebHook(`https://yourserver.com/${token}`);

// Listen for incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.toLowerCase();

  // If the message contains the keyword "job", ask the user for more details
  if (message.includes('job')) {
    bot.sendMessage(chatId, 'What kind of job are you looking for?');
  }

  // If the user responds with a job title, search for job listings
  if (message.includes('developer')) {
    const location = 'ethiopia'; // You can change this to the user's location if available
    const keyword = 'developer';
    const url = `https://www.indeed.com/jobs?q=${keyword}&l=${location}`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const jobs = $('.jobsearch-SerpJobCard');

      // Send the top 5 job listings to the user
      for (let i = 0; i < 5; i++) {
        const job = jobs[i];
        const title = $(job).find('.title').text().trim();
        const company = $(job).find('.company').text().trim();
        const location = $(job).find('.location').text().trim();
        const link = 'https://www.indeed.com' + $(job).find('.title > a').attr('href');

        bot.sendMessage(chatId, `${title}\n${company}\n${location}\n${link}\n`);
      }
    } catch (error) {
      console.error(error);
    }
  }
});
