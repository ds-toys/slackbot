const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./g-sheet-327101-133255eda106.json');

const gsheet = async() => {
    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet('1ukihBN0MaTnYircnWBRFi_TpvJSt570_Xid0YwX4yXM');
    
    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth(creds)
    
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);
    await doc.updateProperties({ title: 'renamed doc' });
    
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    console.log(sheet.title);
    console.log(sheet.rowCount);
    
    // adding / removing sheets
    const newSheet = await doc.addSheet({ title: 'hot new sheet!' });
    await newSheet.delete();
}

gsheet().catch(e => console.log('!!!!', e));;