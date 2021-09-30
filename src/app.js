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
            return
        }

        if(eventText === '점심' || eventText === '밥'){
            const menu = await recommends()
            await send(`✨추천 메뉴✨ ${menu}`)
            return
        }

        const restaurants = await gsheet()

        if(eventText === '리스트' || eventText === '전체') {
            const promises = restaurants.map(async (restaurant) => {
                return await place(restaurant.id)
            })
            const list = await Promise.all(promises)
            await send(list.toString())
            return 
        }

        const found = restaurants.find(({id, name}) => {
            return name === eventText
        })

        if(found) {
            const rPlace = await place(found.id)
            await send(rPlace)
            return
        }
    }
})

app.post('/slack/events', async(req, res) => {
    res.sendStatus(200)
    const bodyType = req.body.type
    const eventType = req.body.event.type
    const eventText = req.body.event.text
    if(bodyType === 'event_callback' && eventType === "message") {
        if(eventText === 'Hello') {
            await send(`World!`)
            return
        }

        if(eventText === '명령어') {
            await send(`Hello \n점심 또는 밥 \n리스트 또는 전체 \n[식당이름]`)
            return
        }

        if(eventText === '점심' || eventText === '밥'){
            const menu = await recommends()
            await send(`✨추천 메뉴✨ ${menu}`)
            return
        }

        const restaurants = await gsheet()

        if(eventText === '리스트' || eventText === '전체') {
            const promises = restaurants.map(async (restaurant) => {
                return await place(restaurant.id)
            })
            const list = await Promise.all(promises)
            await send('🍕🍔🍟🌭🍿🥗 전체 리스트 🥙🥪🍗🍘🍙🍛🍜' + list.toString())
            return 
        }

        const found = restaurants.find(({id, name}) => {
            return name === eventText
        })

        if(found) {
            const rPlace = await place(found.id)
            await send(rPlace)
            return
        }
        
    }
    
})

const recommends = async() => {
    const recommendedPlaceIds = await randomSearch()
    const promises = recommendedPlaceIds.map(async ({id, name}) => {
        return await place(id)
    })
    let rPlaces = await Promise.all(promises);
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