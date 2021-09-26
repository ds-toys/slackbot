const axios = require('axios')

const place = async(placeId) => {
    const PLACE_URL = `https://map.naver.com/v5/api/sites/summary/${placeId}`
    return axios.get(PLACE_URL, {
        params: {
            lang:'ko'
        }
    }).then((res) => {
        console.log(res.data.id)
        return res.data
    }).catch((error) => {
        console.log(error)
    })
}

module.exports = place