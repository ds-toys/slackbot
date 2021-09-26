const axios = require('axios')
const PLACE_ID = 1067394552
const PLACE_URL = `https://map.naver.com/v5/api/sites/summary/${PLACE_ID}`

const place = async(PLACE_URL) => {
    await axios.get(PLACE_URL, {
        params: {
            lang:'ko'
        }
    }).then((res) => {
        console.log(res.data)
    }).catch((error) => {
        console.log(error)
    })
}

place(PLACE_URL)

// module.exports = place