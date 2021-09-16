const { SlackAdapter } = require('botbuilder-adapter-slack');
let { Botkit } = require('botkit');
require('dotenv').config()

const adapter = new SlackAdapter({
    verificationToken: process.env.SLACK_VERIFY_TOKEN,
    clientSigningSecret: process.env.SLACK_SIGNING_SECRET,
    botToken: process.env.SLACK_ACCESS_TOKEN
})

const controller = new Botkit({
    adapter,
    // ...other options
});

controller.on('message', async(bot, message) => {
    await bot.reply(message, 'I heard a message!');
});