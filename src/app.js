require('dotenv').config()
const axios = require('axios')
const qs = require('qs')
const { SlackAdapter } = require('botbuilder-adapter-slack');
let { Botkit } = require('botkit');

const SLACK_ACCESS_TOKEN = process.env.SLACK_ACCESS_TOKEN
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET

const adapter = new SlackAdapter({
    verificationToken: process.env.SLACK_VERIFY_TOKEN,
    clientSigningSecret: SLACK_SIGNING_SECRET,
    botToken: SLACK_ACCESS_TOKEN
})

const controller = new Botkit({
    adapter,
    // ...other options
});

controller.on('message', async(bot, message) => {
    await bot.reply(message, 'I heard a message!');
});


const send = async(message) => {
    await axios.post('https://slack.com/api/chat.postMessage', qs.stringify({
        token: SLACK_ACCESS_TOKEN,
        channel: 'bot-test',
        text: message
    })).then((res) => {
        console.log(res.data)
    }).catch((error) => {
        console.log(error)
    })
}

// send('Hi')