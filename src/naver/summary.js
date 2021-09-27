const axios = require('axios')

const place = async(placeId) => {
    const PLACE_URL = `https://map.naver.com/v5/api/sites/summary/${placeId}`
    return axios.get(PLACE_URL, {
        params: {
            lang:'ko'
        }
    }).then((res) => {
        return `\n${res.data.name.padEnd(35)} ${res.data.categories} https://map.naver.com/v5/entry/place/${res.data.id}`
    }).catch((error) => {
        console.log(error)
    })
}

module.exports = place