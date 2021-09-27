const express = require('express')
const send = require('./slack/index')
const place = require('./naver/summary')
const gsheet = require('./google/gsheet')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3003
const RECOMMEND_NUMBER = 5;

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

        if(eventText === '점심' || eventText === '밥'){
            const menu = await recommends()
            await send(`✨추천 메뉴✨ ${menu}`)
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

        if(eventText === '점심' || eventText === '밥'){
            await send(`✨추천 메뉴✨${recommends()}`)
        }
    }
    res.sendStatus(200)
})

const recommends = async() => {
    const recommendedPlaceIds = await randomSearch()
    const promises = recommendedPlaceIds.map(async ({id, name}) => {
        return await place(id)
    })
    let rPlaces = await Promise.all(promises);
    console.log('pl', rPlaces)

    return rPlaces
}

const randomSearch = async() => {
    const restaurants = await gsheet()
    return getSomeRandomNumbers(restaurants, RECOMMEND_NUMBER).map(number => {
        return restaurants[number]
    })
}

const getSomeRandomNumbers = (restaurants, quantity) => {
    let numbers  =[]
    for(let i = 0; i < quantity; i++){
        const rNum = getRandomInt(0, restaurants.length)
        if(numbers.includes(rNum)){
            i--
        }else{
            numbers.push(rNum)
        }
    }
    return numbers
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`, )
})