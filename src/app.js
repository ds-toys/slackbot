const express = require('express')
const send = require('./slack/index')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3003

app.use(express.json())

app.get('/', async(req, res) => {
    const text = req.query.text
    res.send(text)
    await send(text)
})

app.post('/', async(req, res) => {
    res.send(req.body.challenge)
})

app.post('/slack/events', async(req, res) => {
    const bodyType = req.body.type
    const eventType = req.body.event.type
    const eventText = req.body.event.text
    if(bodyType === 'event_callback' && eventType === "message") {
        if(eventText === 'Hello') {
            await send(`World!`)
        }

        if(eventText.includes('점심') || eventText.includes('밥')){
            await send(`추천 메뉴: ${recommends()}`)
        }
    }
    res.sendStatus(200)
})

const recommends = () => {
    return '1. 돈까스, 2. 텐동, 3. 라멘'
}

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`, )
})