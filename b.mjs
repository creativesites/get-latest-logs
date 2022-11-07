import { GoogleSpreadsheet } from'google-spreadsheet';
import CREDENTIALS  from "./sheets.json" assert { type: "json" };
const RESPONSES_SHEET_ID = '1gza3a05wWV4bt7c9pMyJsm43hpbCpPx84Uctym2zjOg';
import * as cron from 'node-cron'
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);

async function ab(){
    await doc.useServiceAccountAuth(CREDENTIALS);

    // load the documents info
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['LastTenConv'];
    console.log(sheet.title);
    await sheet.delete();
    const newSheet = await doc.addSheet(
        {title: 'LastTenConv', headerValues: ['CallTime', 'Agent', 'Conversations', 'LastIteration', 'Type','TrainingString', 'isBookingIntent', 'TimeSlotsGiven', 'BookingCompleted', 'nh', 'Notes', 'Iterations', 'Date', 'Time', 'Reviewed', 'Problem Found'] }
    );
}
ab();