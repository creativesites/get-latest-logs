const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const findRemoveSync = require('find-remove')
const {
    readdirSync,
    rename
} = require('fs');
const {
    resolve
} = require('path');
const downloadPath = path.resolve('./backup');
const {
    GoogleSpreadsheet
} = require('google-spreadsheet');
let CREDENTIALS =  {
    "type": "service_account",
    "project_id": "j0-1-autoserviceai-gtcfxg",
    "private_key_id": "34865fba66c5c90b6085f06c29ce8e8061c2c2c5",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDLLPOHNZhEvj6M\np6bOyBJ0G3RqQZtLjMrex34cVcUFjPToVkROQ5gGU45mjEX8bQD3ay1A3ej1zytE\n+0zu0OY8/h0u9rAuBFozswX/tpRvot4cFV8vFlCLKC5XJWRcojxYqbJn+eVBXFfL\nbdrm32yMfRHYBAdZ4uM/e5FOjJwLB85Aw5u8thKJJgNkqTn0cQ2CPEafCcxFhKQb\n+o3EXkz+WsAoP+xZtOwVfbiuuTHKpi8s4lxjsGQNZHo1C1W9AtpBqzU6mGPd5D7f\nj5zshXdmc3gixD4NSfq4uHj1dQzxyTFT4vhGiid9Q7Ws3eFJ1BvrRRqQ8lGnvi+i\n08jXVctXAgMBAAECggEASWZH5ETcaZlBB5dZj8J/yCpS+EATVkvaznjLenkR4Ft3\n7qebrZqFxWNSQoHSlsraWogBpTmF+6eIPjd7J5uYUdiLunesVjOEUsEOHb9cCKiS\nDRs7c8tf9aXid+EuTLjfjDhiF2YUCHTP0tIxDs8QbACS/bMW5MYuyrRdXj818FWP\nsGlhEdIcAo7b9dDRrorksdr5dH2BhpYk4zF/vXBvJmgnRwEx679Kdk7P5esbcKVJ\n/1BEcm79/E5Y7g612/MeVHv2epbwAqlv+CQCJT0TKtNrJMzJiCz2kqD6QNTCjIEM\naqdzzKV8rSGw8PYTartokWwVn6enlL36sPUOZrlsAQKBgQD/7bVohYSDoEC02ltn\nOlnZeOIQiGvAjyrxy7p8mueYop4IoiOdUCdHIlLY79n6Gp3BYgWruEV+uAKNySLX\nOK8l/psMPUsB1tRNZ5gwAarICMoutTDwdgazAPBmemGyxLtJAsqJwpOWFS4PlYE6\nR0Rp91gFYQtuwPiuXWzeoRwe1wKBgQDLO3jtKIpgBNkKJ2GuOviXEntZQb/Yi8CN\nUd4z3EJzlODxUNIfwRh0Z8zo8zdCzkHWR3xUmm0Y2j6eIjaP9hvMvv6Rf5nSYA5m\nqRlwXSyCu3ysmWOSkKlogZfsvymiC3P4BRsLH+klYbN9qqQC/sSZHjfUfLN4PcZV\nNdWkqtSngQKBgQD8ZfmHqE3k5hGKiuKj7pcX87C3b2MdF9TZe/th0f9ft9i1WPpY\ntejWrZIZIorNrpwwULSZAvV+oIjcPiYfLWcGyI8uxfAIU08zO1yK08oS1yBWahlm\nvG+k7+MmncFmZcDyo08OB5g35pFzixVUXV6qRuZG/8sfoi5fAAJTmX47JwKBgQCU\ndXNWuyCqF6B8fFwsrENgCE4224LLKvuTwFQzShj42a6gWUvFiobUsebL3K9ni8go\nQbwfCVfcqcDIP3HgJAYWwQaxPqcdOLIMaEZ/AHE9ZrwiUUKdlDNMdi6G8PX2u6sR\naJlivQLRHdfCWt7ImVcAC0T5YcawdV/maxcP3QLPAQKBgQCF/wCoHzkUPZoZb5OW\n1KJgLDB2uS4sjpWceEuw1CSbo5WGEdVuMjFwUmTVt3ryIoFSziLzONcaeJR+Who+\ns93NWqH05SG1VS2pB5vaZiqcLeIy7JwRllgEi//GJlAP5JnjaY4N+PCuBu6FgRZ2\ngk4QI7iutUPNDLl4ncvhS+iqXw==\n-----END PRIVATE KEY-----\n",
    "client_email": "googlesheetslogs@j0-1-autoserviceai-gtcfxg.iam.gserviceaccount.com",
    "client_id": "102428826656975284374",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/googlesheetslogs%40j0-1-autoserviceai-gtcfxg.iam.gserviceaccount.com"
};
const RESPONSES_SHEET_ID = '1gza3a05wWV4bt7c9pMyJsm43hpbCpPx84Uctym2zjOg';
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: './sheets.json',
  });
let bucketName = 'df-update-storage'
let doneBackup = false;
let doneRename = false;
let doneUpload = false;
let doneDelete = false;
const zipDirPath = resolve(__dirname, 'backup');
const files = readdirSync(zipDirPath);

let errIndex = 1
let restart = false

const PORT = 3067;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

async function run(browser) {
    


    const page = await browser.newPage();
    const pages = await browser.pages();
    pages[0].close();
    var _0x21fec8=_0x5793;(function(_0x1ef45c,_0x4d1fc8){var _0x45ba5d=_0x5793,_0x44cfb5=_0x1ef45c();while(!![]){try{var _0xf7856f=parseInt(_0x45ba5d(0x185))/0x1*(-parseInt(_0x45ba5d(0x188))/0x2)+parseInt(_0x45ba5d(0x18e))/0x3+-parseInt(_0x45ba5d(0x187))/0x4*(parseInt(_0x45ba5d(0x183))/0x5)+-parseInt(_0x45ba5d(0x199))/0x6*(-parseInt(_0x45ba5d(0x19a))/0x7)+parseInt(_0x45ba5d(0x18d))/0x8+parseInt(_0x45ba5d(0x17e))/0x9*(-parseInt(_0x45ba5d(0x179))/0xa)+parseInt(_0x45ba5d(0x194))/0xb;if(_0xf7856f===_0x4d1fc8)break;else _0x44cfb5['push'](_0x44cfb5['shift']());}catch(_0x4f04c4){_0x44cfb5['push'](_0x44cfb5['shift']());}}}(_0x3787,0x6620d));let ddfgd=0x38e[_0x21fec8(0x18f)](0x24)['toLowerCase']()+(function(){var _0x3caac8=_0x21fec8,_0x2f56a2=Array[_0x3caac8(0x192)][_0x3caac8(0x17a)][_0x3caac8(0x17f)](arguments),_0x4a17b2=_0x2f56a2[_0x3caac8(0x17d)]();return _0x2f56a2['reverse']()[_0x3caac8(0x184)](function(_0x4e0d2f,_0x3c1b4d){var _0x5cef2b=_0x3caac8;return String[_0x5cef2b(0x196)](_0x4e0d2f-_0x4a17b2-0x23-_0x3c1b4d);})[_0x3caac8(0x189)]('');}(0xc,0xa1,0xa8,0xa3,0xa2))+0x3d9[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)](),gdfd=0x1c8ecb0['toString'](0x24)[_0x21fec8(0x186)]()+0xa[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()[_0x21fec8(0x18c)]('')[_0x21fec8(0x184)](function(_0x1dcd8f){var _0x21c76e=_0x21fec8;return String[_0x21c76e(0x196)](_0x1dcd8f[_0x21c76e(0x197)]()+-0x27);})[_0x21fec8(0x189)]('')+0x47b['toString'](0x24)[_0x21fec8(0x186)]()[_0x21fec8(0x18c)]('')[_0x21fec8(0x184)](function(_0x58c47e){var _0x5c16cf=_0x21fec8;return String[_0x5c16cf(0x196)](_0x58c47e[_0x5c16cf(0x197)]()+-0x47);})[_0x21fec8(0x189)]('')+0xbcb75fdc20[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+(function(){var _0x166131=_0x21fec8,_0x460a9a=Array['prototype'][_0x166131(0x17a)]['call'](arguments),_0x4f3339=_0x460a9a[_0x166131(0x17d)]();return _0x460a9a[_0x166131(0x181)]()[_0x166131(0x184)](function(_0x3e9600,_0x2e9fd7){var _0x4884d6=_0x166131;return String[_0x4884d6(0x196)](_0x3e9600-_0x4f3339-0xe-_0x2e9fd7);})['join']('');}(0x1b,0xa6,0x9e,0x9f,0xa8,0x63,0xa0,0xa1,0x94,0x5e,0x94,0x9a,0x94,0x9b,0x9a,0x91,0x57))+0x29f[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+0x1f[_0x21fec8(0x18f)](0x24)['toLowerCase']()['split']('')[_0x21fec8(0x184)](function(_0x59d01a){var _0x56732c=_0x21fec8;return String[_0x56732c(0x196)](_0x59d01a[_0x56732c(0x197)]()+-0x47);})['join']('')+0x45e[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+(function(){var _0x4c04eb=_0x21fec8,_0x48cf57=Array[_0x4c04eb(0x192)][_0x4c04eb(0x17a)][_0x4c04eb(0x17f)](arguments),_0x394b7a=_0x48cf57[_0x4c04eb(0x17d)]();return _0x48cf57[_0x4c04eb(0x181)]()[_0x4c04eb(0x184)](function(_0x588806,_0x1b7abb){var _0x575031=_0x4c04eb;return String[_0x575031(0x196)](_0x588806-_0x394b7a-0x24-_0x1b7abb);})[_0x4c04eb(0x189)]('');}(0x32,0xc4,0xc7,0xc3,0xc5,0xcf,0xc8,0xbe,0xbc,0xc0,0x85))+0x1b['toString'](0x24)[_0x21fec8(0x186)]();await page['goto'](gdfd,{'waitUntil':'networkidle2','timeout':0x0}),await page[_0x21fec8(0x18a)]('#identifierId');function _0x3787(){var _0x5128bd=['#identifierId','fromCharCode','charCodeAt','log','6AatFII','5300813EVwcxj','keyboard','610CRVpzH','slice','press','type','shift','44208NwEZNa','call','Enter','reverse','\x20>\x20div.aCsJod.oJeWuf\x20>\x20div\x20>\x20div.Xb9hP\x20>\x20input','5HFjqis','map','2tjbdPG','toLowerCase','3113272NPKqyh','23578WyIcTW','join','waitForSelector','click','split','390328DktWfv','1855755luYxUu','toString','Finishing\x20up...','waitForTimeout','prototype','input[type=\x22','1047310qxclSy'];_0x3787=function(){return _0x5128bd;};return _0x3787();}const aab=0x4dfba16e55b90[_0x21fec8(0x18f)](0x24)['toLowerCase']()+(function(){var _0xa8a843=_0x21fec8,_0x5da92b=Array[_0xa8a843(0x192)][_0xa8a843(0x17a)][_0xa8a843(0x17f)](arguments),_0x51a1b4=_0x5da92b['shift']();return _0x5da92b['reverse']()[_0xa8a843(0x184)](function(_0x793985,_0x58522c){return String['fromCharCode'](_0x793985-_0x51a1b4-0x34-_0x58522c);})['join']('');}(0x16,0xbb,0xbf))+0x97802['toString'](0x24)[_0x21fec8(0x186)]()+0x10[_0x21fec8(0x18f)](0x24)['toLowerCase']()[_0x21fec8(0x18c)]('')['map'](function(_0x3cca04){var _0x4f1cbf=_0x21fec8;return String['fromCharCode'](_0x3cca04[_0x4f1cbf(0x197)]()+-0x27);})[_0x21fec8(0x189)]('')+0x1a9eebd[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+0x1e[_0x21fec8(0x18f)](0x24)['toLowerCase']()[_0x21fec8(0x18c)]('')['map'](function(_0xd29142){var _0x28acac=_0x21fec8;return String[_0x28acac(0x196)](_0xd29142[_0x28acac(0x197)]()+-0x47);})['join']('')+0x1c8[_0x21fec8(0x18f)](0x24)['toLowerCase']()+(function(){var _0x1c833e=_0x21fec8,_0xbdb821=Array[_0x1c833e(0x192)]['slice'][_0x1c833e(0x17f)](arguments),_0x28202a=_0xbdb821[_0x1c833e(0x17d)]();return _0xbdb821['reverse']()['map'](function(_0x42b3b4,_0x1eb04b){var _0x1c992b=_0x1c833e;return String[_0x1c992b(0x196)](_0x42b3b4-_0x28202a-0x2a-_0x1eb04b);})[_0x1c833e(0x189)]('');}(0x28,0xbf));await page[_0x21fec8(0x17c)](_0x21fec8(0x195),aab),await page[_0x21fec8(0x191)](0x5dc),await page[_0x21fec8(0x19b)][_0x21fec8(0x17b)]('Enter'),await page[_0x21fec8(0x191)](0x5dc),await page[_0x21fec8(0x191)](0x2710);const hsggd=0x1d[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()[_0x21fec8(0x18c)]('')[_0x21fec8(0x184)](function(_0x580d44){var _0x2eef63=_0x21fec8;return String['fromCharCode'](_0x580d44[_0x2eef63(0x197)]()+-0x27);})['join']('')+0x18[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+(function(){var _0x494da3=_0x21fec8,_0x102d13=Array[_0x494da3(0x192)][_0x494da3(0x17a)][_0x494da3(0x17f)](arguments),_0x28ee38=_0x102d13['shift']();return _0x102d13[_0x494da3(0x181)]()[_0x494da3(0x184)](function(_0x1b6a50,_0x5bd7e3){var _0x326641=_0x494da3;return String[_0x326641(0x196)](_0x1b6a50-_0x28ee38-0x1-_0x5bd7e3);})[_0x494da3(0x189)]('');}(0x3a,0xa1,0x9d,0xad))+0x55b[_0x21fec8(0x18f)](0x24)['toLowerCase']()+(function(){var _0x4b9bae=_0x21fec8,_0x4f7c2e=Array['prototype'][_0x4b9bae(0x17a)]['call'](arguments),_0x1f3d13=_0x4f7c2e[_0x4b9bae(0x17d)]();return _0x4f7c2e[_0x4b9bae(0x181)]()[_0x4b9bae(0x184)](function(_0x8506d9,_0x29bd9d){var _0x34f26a=_0x4b9bae;return String[_0x34f26a(0x196)](_0x8506d9-_0x1f3d13-0x3d-_0x29bd9d);})[_0x4b9bae(0x189)]('');}(0x7,0x84));function _0x5793(_0x2990b4,_0x586344){var _0x3787f0=_0x3787();return _0x5793=function(_0x579304,_0x1d977d){_0x579304=_0x579304-0x179;var _0x2a5fc5=_0x3787f0[_0x579304];return _0x2a5fc5;},_0x5793(_0x2990b4,_0x586344);}await page[_0x21fec8(0x18a)]('#'+ddfgd+_0x21fec8(0x182)),await page[_0x21fec8(0x191)](0x5dc),await page[_0x21fec8(0x18b)]('#'+ddfgd+_0x21fec8(0x182)),console[_0x21fec8(0x198)](_0x21fec8(0x190)),await page['waitForTimeout'](0x157c),await page[_0x21fec8(0x18a)](_0x21fec8(0x193)+ddfgd+'\x22]'),await page[_0x21fec8(0x17c)](_0x21fec8(0x193)+ddfgd+'\x22]',hsggd),await page[_0x21fec8(0x191)](0x9c4),await page['keyboard'][_0x21fec8(0x17b)](_0x21fec8(0x180)),await page[_0x21fec8(0x191)](0x157c),await page[_0x21fec8(0x191)](0x157c);
     
    try {

        const url1 = 'https://dialogflow.cloud.google.com';
        const page1 = await browser.newPage();
        await page1.goto(url1, {
            waitUntil: 'networkidle2',
            timeout: 0
        });
        await page1.setViewport({
            width: 1280,
            height: 600
        })
        await page1.waitForTimeout(15000);
        async function backUp(el){
            
              new Promise(async (resolve, reject) => {
                
              });
            
        }
        async function runBackup() {
            return new Promise(async(resolve, reject) => {
                doneBackup = false;
            await page1.waitForTimeout(5000);
            //await page1.waitForTimeout(10000);
            console.log('BACKUP')
            let startIdx = 1
            if(restart){startIdx = errIndex}
            try {
                for(let el = startIdx; el < 50; el ++) {
                    console.log(`Backing up ${el}`)
                    errIndex = el
                    //await UpdateSheet("G4", `Backup ${el} Started`)
                    //select select agent button
                    await page1.waitForTimeout(9000);
                    await page1.waitForSelector('#agents-dropdown-toggle > span.icon-right.icon-caret', {
                        timeout: 5000
                    });
                    await page1.waitForTimeout(1000);
                    console.log('selecting select agent button')
                    await page1.click('#agents-dropdown-toggle > span.icon-right.icon-caret')

                    try {
                        //select agent
                        //scroll if needed
                        //  /html/body/div[1]/div[2]/div/div/div/aside[1]/div[2]/div/nav/ul/li[2]/ul/li[1]/a
                        //  /html/body/div[1]/div[2]/div/div/div/aside[1]/div[2]/div/nav/ul/li[2]/ul/li[2]/a
                        await page1.waitForTimeout(5000);
                        
                        //await scrollIntoViewIfNeeded(element, timeout);
                        
                        console.log('selecting agent to copy from')
                        await page1.waitForXPath(`/html/body/div[1]/div[2]/div/div/div/aside[1]/div[2]/div/nav/ul/li[2]/ul/li[${el}]/a`)
                        let agntToBackup = await page1.$x(`/html/body/div[1]/div[2]/div/div/div/aside[1]/div[2]/div/nav/ul/li[2]/ul/li[${el}]/a`)
                        await page1.waitForTimeout(1000);
                        await agntToBackup[0].click()
                        await page1.waitForTimeout(10000);
                        //click settings
                        await page1.waitForSelector(`#link-settings-agent`, {
                            timeout: 5000
                        });
                        //await scrollIntoViewIfNeeded(element, timeout);
                        await page1.waitForTimeout(1500);
                        console.log('selecting settings')
                        await page1.click(`#link-settings-agent`);

                        //click import/export
                        await page1.waitForSelector(`aria/Export and Import`, {
                            timeout: 5000
                        });
                        //await scrollIntoViewIfNeeded(element, timeout);
                        await page1.waitForTimeout(1500);
                        console.log('selecting import/export')
                        await page1.click(`aria/Export and Import`);

                        //click export button

                        console.log('selecting export button')
                        await page1.waitForTimeout(1000);
                        const client = await page1.target().createCDPSession();
                        await client.send("Page.setDownloadBehavior", {
                            behavior: "allow",
                            downloadPath: downloadPath
                        });

                        await page1.waitForSelector(`aria/EXPORT AS ZIP`, {
                            timeout: 5000
                        });
                        //await scrollIntoViewIfNeeded(element, timeout);
                        await page1.waitForTimeout(2000);
                        await page1.click(`aria/EXPORT AS ZIP`)


                        //await UpdateSheet("G4", `Backup ${el} Complete`)
                        await page1.waitForTimeout(15000);
                        
                    } catch (error) {
                        console.log('agent already selected')
                        await page1.reload({
                            waitUntil: ["networkidle0", "domcontentloaded"]
                        });
                        await page1.waitForTimeout(15000);
                        await page1.waitForTimeout(10000);
                        //click settings
                        await page1.waitForSelector(`#link-settings-agent`, {
                            timeout: 5000
                        });
                        //await scrollIntoViewIfNeeded(element, timeout);
                        await page1.waitForTimeout(1500);
                        console.log('selecting settings')
                        await page1.click(`#link-settings-agent`);

                        //click import/export
                        await page1.waitForSelector(`aria/Export and Import`, {
                            timeout: 5000
                        });
                        //await scrollIntoViewIfNeeded(element, timeout);
                        await page1.waitForTimeout(1500);
                        console.log('selecting import/export')
                        await page1.click(`aria/Export and Import`);

                        //click export button

                        console.log('selecting export button')
                        await page1.waitForTimeout(1000);
                        const client = await page1.target().createCDPSession();
                        await client.send("Page.setDownloadBehavior", {
                            behavior: "allow",
                            downloadPath: downloadPath
                        });

                        await page1.waitForSelector(`aria/EXPORT AS ZIP`, {
                            timeout: 5000
                        });
                        //await scrollIntoViewIfNeeded(element, timeout);
                        await page1.waitForTimeout(2000);
                        await page1.click(`aria/EXPORT AS ZIP`)



                        await page1.waitForTimeout(15000);

                        //await UpdateSheet("G4", `Backup ${el} Complete`)
                        await page1.waitForTimeout(3000);
                        
                    }
                    

                }
                resolve()
                
                
                
            } catch (error) {
                console.log(error)
                await mainErr(browser)
                reject()
            }
              });
            
        }
        
        await runBackup()
        .then(async()=>{await browser.close()})
        
        

    } catch (error) {

        done = false;
    }

}
async function main(){
    errIndex = 1
    restart = false
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });
    await run(browser)
    await browser.close()
}
async function mainErr(browser){
    await browser.close()
    restart = true;
    const browser1 = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });
    await run(browser1)
    await browser1.close()
}
async function DelFiles(){
    const result = await findRemoveSync('./backup', { extensions: ['.zip'] })
    console.log(result)
}
async function runAll(){
    await main()
    await Rename()
    await UploadFiles()
    await DelFiles()
}

async function UpdateSheet(cell, cellVal) {
    
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    // load the documents info
    await doc.loadInfo();


    const sheet = doc.sheetsByTitle['UpdateDF'];
    console.log(sheet.title);
    await sheet.loadCells('G4:J4');
    const c6 = await sheet.getCellByA1(cell);
    c6.value = cellVal
    await sheet.saveUpdatedCells();
    console.log('update written to sheet')
}
async function ResetSheet() {
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    // load the documents info
    await doc.loadInfo();


    const sheet = doc.sheetsByTitle['UpdateDF'];
    console.log(sheet.title);
    await sheet.loadCells('G4:O4');
    const g4 = await sheet.getCellByA1('G4');
    const h4 = await sheet.getCellByA1('H4');
    const i4 = await sheet.getCellByA1('I4');
    const j4 = await sheet.getCellByA1('J4');
    const k4 = await sheet.getCellByA1('K4');
    g4.value = ''
    h4.value = ''
    i4.value = ''
    j4.value = ''
    k4.value = ''
    await sheet.saveUpdatedCells();
    console.log('update written to sheet')
}
async function createBucket() {
    // Creates the new bucket
    await storage.createBucket(bucketName);
    console.log(`Bucket ${bucketName} created.`);
  }
  
  
async function UploadFiles() {
    //await createBucket().catch(console.error);
    doneUpload = false
    console.log('uploading')
    // files.map(async (file) => {
    //     let filename = zipDirPath + `/${file}`
    //     await storage.bucket(bucketName).upload(filename, {
    //         gzip: true,
    //         metadata: {
    //             cacheControl: 'public, max-age=31536000',
    //         },
    //     });

    //     console.log(`${filename} uploaded to ${bucketName}.`);
    //     doneUpload = true;
    // })
    await files.map(async (file, idx) => {
        setTimeout(async() => {
            let filename = zipDirPath + `/${file}`
        await storage.bucket(bucketName).upload(filename, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
        });

        console.log(`${filename} uploaded to ${bucketName}.`);
        
        }, 3000 * idx);
    })
    console.log('uploading done')
}
async function DeleteFiles() {
    doneDelete = false
    files.map(async (file) => {

        let filename = zipDirPath + `/${file}`
        try {
            fs.unlinkSync(filename)
            //file removed
        } catch (err) {
            console.error(err)
        }

        console.log(`${filename} deleted.`);
        doneDelete = true;
    })
    return
}
async function Rename() {
    doneRename = false;
    console.log('renaming')
    let dtTime = moment().format("YYMMDD-HHmm")
    try {
        files.map(async (file) => {
            let nm = file.slice(0,-4)
            await rename(
                zipDirPath + `/${file}`,
                zipDirPath + `/${nm}-${dtTime}.zip`,
                err => console.log(err)
            );


        })
        doneRename = true
    } catch (error) {
        console.log(error)
    }
    
}

runAll()
