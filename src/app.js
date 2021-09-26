const express = require('express')
const send = require('./slack/index')
const place = require('./naver/summary')
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
    const bodyType = req.body.type
    const eventType = req.body.event.type
    const eventText = req.body.event.text
    if(bodyType === 'event_callback' && eventType === "message") {
        if(eventText === 'Hello') {
            await send(`World!`)
        }

        if(eventText.includes('점심') || eventText.includes('밥')){
            const menu = recommends()
            await send(`추천 메뉴: ${menu}`)
        }
    }
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

const recommends = async() => {
    const PLACE_ID = 1067394552
    const recommendPlace = await place(PLACE_ID)
    console.log(recommendPlace.name)
    return `${recommendPlace.id}, ${recommendPlace.name}`
}

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`, )
})