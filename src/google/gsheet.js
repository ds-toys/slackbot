const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./g-sheet-327101-133255eda106.json');
require('dotenv').config()
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

const gsheet = async() => {
    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(GOOGLE_API_KEY);
    
    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    const rows = await sheet.getRows(); // can pass in { limit, offset }
    return rows.map(row => {
        return {
            id: row.ID,
            name: row.Name
        }
    })

}

module.exports = gsheet