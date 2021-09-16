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
    res.send(req.body.challenge)
    await send(`event: ${req.body.event}, type: ${req.body.type}, text: ${req.body.event.text}`)
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`, )
})