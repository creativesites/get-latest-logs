const data = require('./tmp1.json');
let tArr = ['330-SansKia_-818-493-9849', '378-EnviCDJRWCovF-8549995366', '380-RegaNiss-BDC-8323088796', 'x301-AutoMercBell-3602271073']
// data.forEach(async (row) => {
    
//     if(tArr.includes(row.agent)){
//         console.log(row.agent)
//         let act = row.data.action;
//         console.log(act)
//         let fulf = row.data.fulfillmentText;
//         fulf = fulf.replace(/"/g, '\\"');
//         fulf = fulf.replace(/<[^>]*>?/gm, '')
//         fulf = fulf.replace(/&nbsp;/g, ' ')
//         console.log(fulf)
//         let outPC = row.data.outputContexts;
//         let outPCString = outPC.map((item) => {
//             return item.name;
//         })
//         let outPCString2 = outPCString.join(', ');
//         console.log(outPCString2)
//     }

    
    
// });

// for (let key in params) {
//     if(key !== 'anyURL') {
//     paramsString += `🪁 ${key}:  ${params[key.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')]}\n`;
//     }
// }
// console.log(paramsString);
let g = ['CallTime', 'Agent', 'Conversations', 'LastIteration', 'Type','TrainingString', 'isBookingIntent', 'TimeSlotsGiven', 'BookingCompleted', 'nh', 'Notes', 'Iterations', 'Date', 'Time', 'Reviewed', 'Problem Found']
console.log(g.join(','))