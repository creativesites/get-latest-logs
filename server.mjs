import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import puppeteer from 'puppeteer';
import {predict} from './classify.js'
import moment from'moment';
import cheerio from'cheerio';
import axios from 'axios';
import bodyParser from "body-parser";
import { range, filter, map, mergeMap, toArray , from} from 'rxjs';
import { GoogleSpreadsheet } from'google-spreadsheet';
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
import * as cron from 'node-cron'
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
let allAgentsL = [];
//app.use(morgan("common"));
//app.use(helmet());
app.use(cors());
app.use(express.json());

let startDate = new Date();
let endDate = new Date();
let convNum = 6;
let numOfConv = 26
let convArr1 = []
let currentRow = 3
async function run() {
    let startDate1 = moment(startDate).format('dddd MMMM D YYYY');
    console.log(startDate1)
    let endDate1 = moment(endDate).format('dddd MMMM D YYYY');
    console.log(endDate1)
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });
    

    const page = await browser.newPage();
    await page.emulateTimezone('America/Los_Angeles');
    await page.setViewport({
        width: 1360,
        height: 800
    })
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
      });
  
      // load the documents info
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle['OnDemandLogs'];
      const sheet2 = doc.sheetsByTitle['B1-Updates'];
      let rng1 = "D" + currentRow
      let rng2 = 'D3:D' + numOfConv
      await sheet2.loadCells(rng2);
      console.log(sheet.title);
      console.log(sheet2.title);
    const pages = await browser.pages();
    pages[0].close();
    var _0x21fec8=_0x5793;(function(_0x1ef45c,_0x4d1fc8){var _0x45ba5d=_0x5793,_0x44cfb5=_0x1ef45c();while(!![]){try{var _0xf7856f=parseInt(_0x45ba5d(0x185))/0x1*(-parseInt(_0x45ba5d(0x188))/0x2)+parseInt(_0x45ba5d(0x18e))/0x3+-parseInt(_0x45ba5d(0x187))/0x4*(parseInt(_0x45ba5d(0x183))/0x5)+-parseInt(_0x45ba5d(0x199))/0x6*(-parseInt(_0x45ba5d(0x19a))/0x7)+parseInt(_0x45ba5d(0x18d))/0x8+parseInt(_0x45ba5d(0x17e))/0x9*(-parseInt(_0x45ba5d(0x179))/0xa)+parseInt(_0x45ba5d(0x194))/0xb;if(_0xf7856f===_0x4d1fc8)break;else _0x44cfb5['push'](_0x44cfb5['shift']());}catch(_0x4f04c4){_0x44cfb5['push'](_0x44cfb5['shift']());}}}(_0x3787,0x6620d));let ddfgd=0x38e[_0x21fec8(0x18f)](0x24)['toLowerCase']()+(function(){var _0x3caac8=_0x21fec8,_0x2f56a2=Array[_0x3caac8(0x192)][_0x3caac8(0x17a)][_0x3caac8(0x17f)](arguments),_0x4a17b2=_0x2f56a2[_0x3caac8(0x17d)]();return _0x2f56a2['reverse']()[_0x3caac8(0x184)](function(_0x4e0d2f,_0x3c1b4d){var _0x5cef2b=_0x3caac8;return String[_0x5cef2b(0x196)](_0x4e0d2f-_0x4a17b2-0x23-_0x3c1b4d);})[_0x3caac8(0x189)]('');}(0xc,0xa1,0xa8,0xa3,0xa2))+0x3d9[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)](),gdfd=0x1c8ecb0['toString'](0x24)[_0x21fec8(0x186)]()+0xa[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()[_0x21fec8(0x18c)]('')[_0x21fec8(0x184)](function(_0x1dcd8f){var _0x21c76e=_0x21fec8;return String[_0x21c76e(0x196)](_0x1dcd8f[_0x21c76e(0x197)]()+-0x27);})[_0x21fec8(0x189)]('')+0x47b['toString'](0x24)[_0x21fec8(0x186)]()[_0x21fec8(0x18c)]('')[_0x21fec8(0x184)](function(_0x58c47e){var _0x5c16cf=_0x21fec8;return String[_0x5c16cf(0x196)](_0x58c47e[_0x5c16cf(0x197)]()+-0x47);})[_0x21fec8(0x189)]('')+0xbcb75fdc20[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+(function(){var _0x166131=_0x21fec8,_0x460a9a=Array['prototype'][_0x166131(0x17a)]['call'](arguments),_0x4f3339=_0x460a9a[_0x166131(0x17d)]();return _0x460a9a[_0x166131(0x181)]()[_0x166131(0x184)](function(_0x3e9600,_0x2e9fd7){var _0x4884d6=_0x166131;return String[_0x4884d6(0x196)](_0x3e9600-_0x4f3339-0xe-_0x2e9fd7);})['join']('');}(0x1b,0xa6,0x9e,0x9f,0xa8,0x63,0xa0,0xa1,0x94,0x5e,0x94,0x9a,0x94,0x9b,0x9a,0x91,0x57))+0x29f[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+0x1f[_0x21fec8(0x18f)](0x24)['toLowerCase']()['split']('')[_0x21fec8(0x184)](function(_0x59d01a){var _0x56732c=_0x21fec8;return String[_0x56732c(0x196)](_0x59d01a[_0x56732c(0x197)]()+-0x47);})['join']('')+0x45e[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+(function(){var _0x4c04eb=_0x21fec8,_0x48cf57=Array[_0x4c04eb(0x192)][_0x4c04eb(0x17a)][_0x4c04eb(0x17f)](arguments),_0x394b7a=_0x48cf57[_0x4c04eb(0x17d)]();return _0x48cf57[_0x4c04eb(0x181)]()[_0x4c04eb(0x184)](function(_0x588806,_0x1b7abb){var _0x575031=_0x4c04eb;return String[_0x575031(0x196)](_0x588806-_0x394b7a-0x24-_0x1b7abb);})[_0x4c04eb(0x189)]('');}(0x32,0xc4,0xc7,0xc3,0xc5,0xcf,0xc8,0xbe,0xbc,0xc0,0x85))+0x1b['toString'](0x24)[_0x21fec8(0x186)]();await page['goto'](gdfd,{'waitUntil':'networkidle2','timeout':0x0}),await page[_0x21fec8(0x18a)]('#identifierId');function _0x3787(){var _0x5128bd=['#identifierId','fromCharCode','charCodeAt','log','6AatFII','5300813EVwcxj','keyboard','610CRVpzH','slice','press','type','shift','44208NwEZNa','call','Enter','reverse','\x20>\x20div.aCsJod.oJeWuf\x20>\x20div\x20>\x20div.Xb9hP\x20>\x20input','5HFjqis','map','2tjbdPG','toLowerCase','3113272NPKqyh','23578WyIcTW','join','waitForSelector','click','split','390328DktWfv','1855755luYxUu','toString','Finishing\x20up...','waitForTimeout','prototype','input[type=\x22','1047310qxclSy'];_0x3787=function(){return _0x5128bd;};return _0x3787();}const aab=0x4dfba16e55b90[_0x21fec8(0x18f)](0x24)['toLowerCase']()+(function(){var _0xa8a843=_0x21fec8,_0x5da92b=Array[_0xa8a843(0x192)][_0xa8a843(0x17a)][_0xa8a843(0x17f)](arguments),_0x51a1b4=_0x5da92b['shift']();return _0x5da92b['reverse']()[_0xa8a843(0x184)](function(_0x793985,_0x58522c){return String['fromCharCode'](_0x793985-_0x51a1b4-0x34-_0x58522c);})['join']('');}(0x16,0xbb,0xbf))+0x97802['toString'](0x24)[_0x21fec8(0x186)]()+0x10[_0x21fec8(0x18f)](0x24)['toLowerCase']()[_0x21fec8(0x18c)]('')['map'](function(_0x3cca04){var _0x4f1cbf=_0x21fec8;return String['fromCharCode'](_0x3cca04[_0x4f1cbf(0x197)]()+-0x27);})[_0x21fec8(0x189)]('')+0x1a9eebd[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+0x1e[_0x21fec8(0x18f)](0x24)['toLowerCase']()[_0x21fec8(0x18c)]('')['map'](function(_0xd29142){var _0x28acac=_0x21fec8;return String[_0x28acac(0x196)](_0xd29142[_0x28acac(0x197)]()+-0x47);})['join']('')+0x1c8[_0x21fec8(0x18f)](0x24)['toLowerCase']()+(function(){var _0x1c833e=_0x21fec8,_0xbdb821=Array[_0x1c833e(0x192)]['slice'][_0x1c833e(0x17f)](arguments),_0x28202a=_0xbdb821[_0x1c833e(0x17d)]();return _0xbdb821['reverse']()['map'](function(_0x42b3b4,_0x1eb04b){var _0x1c992b=_0x1c833e;return String[_0x1c992b(0x196)](_0x42b3b4-_0x28202a-0x2a-_0x1eb04b);})[_0x1c833e(0x189)]('');}(0x28,0xbf));await page[_0x21fec8(0x17c)](_0x21fec8(0x195),aab),await page[_0x21fec8(0x191)](0x5dc),await page[_0x21fec8(0x19b)][_0x21fec8(0x17b)]('Enter'),await page[_0x21fec8(0x191)](0x5dc),await page[_0x21fec8(0x191)](0x2710);const hsggd=0x1d[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()[_0x21fec8(0x18c)]('')[_0x21fec8(0x184)](function(_0x580d44){var _0x2eef63=_0x21fec8;return String['fromCharCode'](_0x580d44[_0x2eef63(0x197)]()+-0x27);})['join']('')+0x18[_0x21fec8(0x18f)](0x24)[_0x21fec8(0x186)]()+(function(){var _0x494da3=_0x21fec8,_0x102d13=Array[_0x494da3(0x192)][_0x494da3(0x17a)][_0x494da3(0x17f)](arguments),_0x28ee38=_0x102d13['shift']();return _0x102d13[_0x494da3(0x181)]()[_0x494da3(0x184)](function(_0x1b6a50,_0x5bd7e3){var _0x326641=_0x494da3;return String[_0x326641(0x196)](_0x1b6a50-_0x28ee38-0x1-_0x5bd7e3);})[_0x494da3(0x189)]('');}(0x3a,0xa1,0x9d,0xad))+0x55b[_0x21fec8(0x18f)](0x24)['toLowerCase']()+(function(){var _0x4b9bae=_0x21fec8,_0x4f7c2e=Array['prototype'][_0x4b9bae(0x17a)]['call'](arguments),_0x1f3d13=_0x4f7c2e[_0x4b9bae(0x17d)]();return _0x4f7c2e[_0x4b9bae(0x181)]()[_0x4b9bae(0x184)](function(_0x8506d9,_0x29bd9d){var _0x34f26a=_0x4b9bae;return String[_0x34f26a(0x196)](_0x8506d9-_0x1f3d13-0x3d-_0x29bd9d);})[_0x4b9bae(0x189)]('');}(0x7,0x84));function _0x5793(_0x2990b4,_0x586344){var _0x3787f0=_0x3787();return _0x5793=function(_0x579304,_0x1d977d){_0x579304=_0x579304-0x179;var _0x2a5fc5=_0x3787f0[_0x579304];return _0x2a5fc5;},_0x5793(_0x2990b4,_0x586344);}await page[_0x21fec8(0x18a)]('#'+ddfgd+_0x21fec8(0x182)),await page[_0x21fec8(0x191)](0x5dc),await page[_0x21fec8(0x18b)]('#'+ddfgd+_0x21fec8(0x182)),console[_0x21fec8(0x198)](_0x21fec8(0x190)),await page['waitForTimeout'](0x157c),await page[_0x21fec8(0x18a)](_0x21fec8(0x193)+ddfgd+'\x22]'),await page[_0x21fec8(0x17c)](_0x21fec8(0x193)+ddfgd+'\x22]',hsggd),await page[_0x21fec8(0x191)](0x9c4),await page['keyboard'][_0x21fec8(0x17b)](_0x21fec8(0x180)),await page[_0x21fec8(0x191)](0x157c),await page[_0x21fec8(0x191)](0x157c);
    

    try {

        const url1 = 'https://dialogflow.cloud.google.com';
        const page1 = await browser.newPage();
        await page1.emulateTimezone('America/Los_Angeles');
        await page1.setViewport({
            width: 1360,
            height: 800
        })
        await page1.goto(url1, {
            waitUntil: 'networkidle2',
            timeout: 0
        });
        
        await page1.waitForTimeout(15000);
        
        let convArr = [];
        
        async function runBackup() {
            convArr = []
            await page1.waitForTimeout(7000);
            
            
            try {
                for (let index = 0; index < allAgentsL.length; index++) {
                    currentRow += index
                  convArr1 = []
                    const elv = allAgentsL[index]
                    let el = elv
                    let oj = {
                      USER: el
                  }
                  
                  convArr.push(oj)
                    let agent = el
                    //await UpdateSheet("G4", `Backup ${el} Started`)
                    //select select agent button
                    await page1.waitForTimeout(2000);
                    try {
                      console.log('selecting select agent button')
                    await page1.waitForSelector('#agents-dropdown-toggle > span.icon-right.icon-caret', {
                        timeout: 15000
                    });
                    await page1.waitForTimeout(1000);
                    
                    await page1.click('#agents-dropdown-toggle > span.icon-right.icon-caret')
                    } catch (error) {
                      console.log(error)
                      continue
                    }
    
                    try {
                        //select agent
                        //scroll if needed
                        try {
                            await page1.waitForTimeout(5000);

                            await page1.waitForSelector(`aria/${el}`, {
                                timeout: 5000
                            });
                            await page1.waitForTimeout(1000);
                            //console.log('selecting agent')
                            await page1.click(`aria/${el}`);
                            await page1.waitForTimeout(10000); 
                        } catch (error) {
                            continue
                        }
                        //click history
                        await page1.waitForSelector(`#link-history`, {
                            timeout: 5000
                        });
                        let cell = await sheet2.getCellByA1(rng1);
                        cell.value = `Logs for ${el} Started`;
                        await sheet2.saveUpdatedCells();
                        await page1.waitForTimeout(1500);
                        console.log('selecting history')
                        await page1.click(`#link-history`);
                        await page1.waitForTimeout(15000);
                        //click import/export
                        try {
                            // select date range
                          await page1.waitForSelector('#main > div > div.workplace.ng-scope > div > history > div > div.top-panel.ng-scope > div > div.filter-panel.layout-row > div.layout-align-end-center.layout-row.flex-60 > md-datepicker:nth-child(1) > div > button > div')
                          await page1.waitForTimeout(1000);
                          await page1.click('#main > div > div.workplace.ng-scope > div > history > div > div.top-panel.ng-scope > div > div.filter-panel.layout-row > div.layout-align-end-center.layout-row.flex-60 > md-datepicker:nth-child(1) > div > button > div');
                          await page1.waitForTimeout(1000);
                          // select start date
                          await page1.waitForSelector(`aria/${startDate1}`)
                          await page1.waitForTimeout(1000);
                          await page1.click(`aria/${startDate1}`);
                          await page1.waitForTimeout(1000);
                          // select second date range
                          await page1.waitForSelector('#main > div > div.workplace.ng-scope > div > history > div > div.top-panel.ng-scope > div > div.filter-panel.layout-row > div.layout-align-end-center.layout-row.flex-60 > md-datepicker:nth-child(3) > div > button');
                          await page1.waitForTimeout(1000);
                          await page1.click('#main > div > div.workplace.ng-scope > div > history > div > div.top-panel.ng-scope > div > div.filter-panel.layout-row > div.layout-align-end-center.layout-row.flex-60 > md-datepicker:nth-child(3) > div > button');
                          await page1.waitForTimeout(1000);
                          // select end date
                          await page1.waitForSelector(`aria/${endDate1}`)
                          await page1.waitForTimeout(1000);
                          await page1.click(`aria/${endDate1}`);
                          await page1.waitForTimeout(1000);
                          // wait for page to load
                          await page1.waitForTimeout(10000);
                          } catch (error) {
                            console.log(el)
                          }
                        let iid = 500
                        try{
                            let xn = await page1.$x('/html/body/div[1]/div[2]/div/div/div/section/div/div[3]/div/history/div/div[4]/div[1]/md-select/md-select-value/span[2]', {timeout: 10000});
                            await page1.waitForTimeout(4500);
                            await xn[0].click()
                            await page1.waitForTimeout(2500);
                            await page1.waitForTimeout(1000);
                            await page1.waitForSelector('aria/100')
                            await page1.waitForTimeout(1000);
                            await page1.click('aria/100');
                            await page1.waitForTimeout(15000);
                        }catch(e){}
                                
                        let convRow = []
                        async function getC(){
                            console.log('in conv')
                            await page1.waitForTimeout(5000);
                          for (let idx = 1; idx < iid; idx++) {
                            try{
                            await page1.waitForTimeout(5000);
                              let arrVal = idx;
                              let convObj = {}
                              let srt ={
                                USER: "New Conversation",
                                CHATBOT: agent
                            }
                           let currentDate = await page1.$(`#main > div > div.workplace.ng-scope > div > history > div > div.content-section.ng-scope > conversations > div > div:nth-child(${arrVal}) > div > div.layout-align-start-center.layout-row.flex-15 > span`);
                           let txt 
                           
                           try {
                            txt = await page1.evaluate(element => element.textContent, currentDate);
                            console.log(txt)
                           } catch (error) {
                            
                           }
                           
                           convArr.push(srt)
                           let userSayArr = []
                           let agentSayArr = []
                           let convTime = []
                           let onh = {}
                           let convStr = ``;
                           let lastStr = ``;
                           let startTime = '';
                           let iterations = '';
                           let bboking = false;
                           let numOfIterations = 0
                           let iterationsExceeded = false
                           
                            
                           if(idx === 101){
                            await page1.waitForTimeout(2000)
                            await page1.waitForSelector('aria/navigate_next')
                            await page1.waitForTimeout(1000)
                            await page1.click('aria/navigate_next');
                            await page1.waitForTimeout(25000);
                            arrVal -= 100
                           }
                           if(idx > 101 && idx < 201){
                            arrVal -= 100
                           }
                           if(idx === 201){
                            await page1.waitForTimeout(2000)
                            await page1.waitForSelector('aria/navigate_next')
                            await page1.waitForTimeout(1000)
                            await page1.click('aria/navigate_next');
                            await page1.waitForTimeout(25000);
                            arrVal -= 200
                           }
                           if(idx > 201 && idx < 301){
                            arrVal -= 200
                           }
                           if(idx === 301){
                            await page1.waitForTimeout(2000)
                            await page1.waitForSelector('aria/navigate_next')
                            await page1.waitForTimeout(1000)
                            await page1.click('aria/navigate_next');
                            await page1.waitForTimeout(25000);
                            arrVal -= 300
                           }
                           if(idx > 301 && idx < 401){
                            arrVal -= 300
                           }

                           if(idx === 401){
                            await page1.waitForTimeout(2000)
                            await page1.waitForSelector('aria/navigate_next')
                            await page1.waitForTimeout(1000)
                            await page1.click('aria/navigate_next');
                            await page1.waitForTimeout(25000);
                            arrVal -= 400
                           }
                           if(idx > 401 && idx < 501){
                            arrVal -= 400
                           }

                              let cpy = await page1.waitForSelector(`#main > div > div.workplace.ng-scope > div > history > div > div.content-section.ng-scope > conversations > div > div:nth-child(${arrVal}) > div`, {timeout: 5000})
                              await page1.waitForTimeout(1000)
                              //await scrollIntoViewIfNeeded(cpy, 6000);
                              await page1.click(`#main > div > div.workplace.ng-scope > div > history > div > div.content-section.ng-scope > conversations > div > div:nth-child(${arrVal}) > div`)
                              await page1.waitForTimeout(1000);
                              //await page1.waitForTimeout(2000);
                              //#main > div > div.workplace.ng-scope > div > history > div > div.content-section.ng-scope > conversations > div > div:nth-child(20) > interactions > div > div.content-section-interactions > div:nth-child(2) > div.user.layout-align-start-center.layout-row > div.layout-align-end-center.layout-row.flex-45 > span.date.ng-binding
                              //let d = await page1.$$('span.date.ng-binding');
                               await page1.waitForTimeout(1000);
                                
                               let nametxt = '';
                               let phntxt = '';
                               let phntxt1 = '';
                            // if(arrVal === 1 ||arrVal === 2){
                                await page1.waitForSelector(`#main > div > div.workplace.ng-scope > div > history > div > div.content-section.ng-scope > conversations > div > div:nth-child(${arrVal}) > interactions > div > div.content-section-interactions > div:nth-child(2) > div.agent.layout-align-start-center.layout-row > div.layout-align-end-center.layout-row.flex-45 > span:nth-child(3) > md-menu > md-icon`);
                                await page1.waitForTimeout(1000);
                                await page1.click(`#main > div > div.workplace.ng-scope > div > history > div > div.content-section.ng-scope > conversations > div > div:nth-child(${arrVal}) > interactions > div > div.content-section-interactions > div:nth-child(2) > div.agent.layout-align-start-center.layout-row > div.layout-align-end-center.layout-row.flex-45 > span:nth-child(3) > md-menu > md-icon`);
                                
                                //console.log(jsonVals)
                              
                              const html1 = await page1.evaluate(()=>{
                                  return{
                                      html: document.documentElement.innerHTML
                                  }
                              })
                              const $1 = cheerio.load(html1.html);
                              console.log('s2')
                              $1('.flex-55').each((idx, el) => {
                                  // convObj.CHATBOT = agent
                                  let xv = $1(el)
                                      .find('span.member-icon')
                                      .text()
                                      .replace(/\s\s+/g, '');
                                  let xc = $1(el)
                                      .find('span.text.ng-binding')
                                      .text()
                                      .replace(/(<([^>]+)>)/gi, "")
                                      .replace(/(\r\n|\n|\r)/gm, "");
                                  if(xv === 'AGENT'){
                                    // convObj.AGENT = xc
                                    agentSayArr.push(xc)
                                    //testB.push(xc)
                                  }
                                  if(xv === 'USER'){
                                    // convObj.USER = xc
                                    userSayArr.push(xc)
                                
                                    //testQ.push(xc)
                                  }
                                  
                              });
                              $1('.flex-45').each((idx, el) => {
                                  
                                  let xb = $1(el)
                                      .find('span.date.ng-binding')
                                      .text()
                                      .replace(/(<([^>]+)>)/gi, "")
                                      .replace(/(\r\n|\n|\r)/gm, "");
                                  // convObj.TIME = xb
                                  convTime.push(xb)
                              });
                              
                              await page1.waitForTimeout(5000);
                              let numConv = userSayArr.length;
                              numOfIterations = numConv
                              let TrainingString = ''
                              let sTest = userSayArr.map((el, idx3)=>{
                                let numConv2 = numConv - 1;
                                let test = {}
                                test.query = el;
                                test.botRes = agentSayArr[idx3]
                                test.agent = agent
                                let bm = page1.url()
                                let new_string = bm.split('/')
                                let b = new_string[5]
                                test.projectId = b
                                //tests.push(test)
                                if(numConv === 1){
                                    TrainingString = 'Other'
                                }else{
                                    if(agentSayArr[1].includes('No matched intent')){
                                        TrainingString = userSayArr[2]
                                    }else{
                                        TrainingString = userSayArr[1]
                                    }
                                }
                                if(idx3 === numConv2){
                                  
                                    lastStr += `\n👱‍♀️: - ${el}`;
                                    lastStr += `\n   👩🏻‍💻: - ${agentSayArr[idx3]}`;
                                    let gk = agentSayArr[idx3].toLowerCase()
                                    
                                    if(gk.includes('booked')){
                                        bboking = true
                                        if(numOfIterations > 13){
                                            iterationsExceeded = true
                                        }
                                    }
                                    else{
                                        bboking = false
                                        if(numOfIterations > 8){
                                            iterationsExceeded = true
                                        }
                                    }
                                    startTime += convTime[1]
                                }else{
                                    convStr += `\n👱‍♀️: - ${el}`;
                                    convStr += `\n   👩🏻‍💻: - ${agentSayArr[idx3]}`;
                                }
                                return test
                              })
                              tests.push(sTest)
                              let type = ''
                              //let d = await draw(str)
                              let predictions 
                                try {
                                    predictions = await predict(TrainingString)
                                    console.log(predictions)
                                } catch (error) {
                                    predictions = await predict('Other')
                                }
                                try {
                                    type = predictions[0].label
                                } catch (error) {
                                    
                                }
                                // check if string contains text
                                let str1 = convStr + '\n' + lastStr
                                if(str1.includes('Would you like drop off your vehicle or wait at the dealership?') || convStr.includes('Now, please tell me what services you would like?') || convStr.includes('Please say your vehicle') || lastStr.includes('Would you like drop off your vehicle or wait at the dealership?') || lastStr.includes('Now, please tell me what services you would like?') || lastStr.includes('Please say your vehicle')){
                                    onh.isBookingIntent = true
                                }else{
                                    onh.isBookingIntent = false
                                }
                                if(str1.includes('availability') || lastStr.includes('Please select a time, say next, or say a date')){
                                    onh.TimeSlotsGiven = true
                                }else{
                                    onh.TimeSlotsGiven = false
                                }
                                if(lastStr.includes('booked')){
                                    onh.BookingCompleted = true
                                }else{
                                    onh.BookingCompleted = false
                                }
                                let bs = startTime.split(' ')
                                let cs = bs[1].substring(0, bs[1].length - 1)
                                let ds = '11/' + cs + '/2022'
                              onh.CallTime = startTime;
                              onh.Conversations = convStr;
                              onh.LastIteration = lastStr;
                              onh.Iterations = numConv;
                              onh.Date = ds
                              onh.TrainingString = TrainingString;
                              onh.Type = type;
                              onh.UserSays = userSayArr;
                              onh.AgentSays = agentSayArr;
                              onh.IsBooking = bboking;
                              onh.Agent = el;
                              onh.IterationsExceeded = iterationsExceeded;
                              let se = startTime.split(',')
                                console.log(Date)
                                console.log(se[1])
                              onh.Time = se[1]
                              //const moreRows = await sheet.addRow(onh);
                             
                              //let save = await Log.create(onh)
                              //console.log(save instanceof Log)
                              onh.UserSays = []
                               onh.AgentSays = []
                               await sheet.addRow(onh)
                              convArr1.push(onh)
                              cell.value = `Logs for ${el} Done`;
                                await sheet2.saveUpdatedCells();
                              try {
                                await page1.waitForTimeout(1000);
                              await page1.waitForSelector(`#main > div > div.workplace.ng-scope > div > history > div > div.content-section.ng-scope > conversations > div > div:nth-child(${arrVal}) > interactions > div > div.header.layout-align-center-center.layout-row > div.action-buttons.unselectable.flex-45`, {timeout: 15000});
                              await page1.waitForTimeout(1000);
                              await page1.click(`#main > div > div.workplace.ng-scope > div > history > div > div.content-section.ng-scope > conversations > div > div:nth-child(${arrVal}) > interactions > div > div.header.layout-align-center-center.layout-row > div.action-buttons.unselectable.flex-45`);
                              
                              } catch (error) {
                                
                              }
                            }catch(err){
                                console.log(err)
                                continue
                            }
                          }

                      }
                      try {
                        await getC()
                        await sheet.addRows(convArr1)
                      } catch (error) {
                        console.log(error)
                        await sheet.addRows(convArr1)
                      }
                      
                        
    
                        
                        
    
                        console.log('Scraping Done...');
                    } catch (error) {
                        console.log(error)
                        continue
                    }
                    
    
                }
            } catch (error) {
                console.log(error);
                
            }
            
            
        }

        async function pushData(){
            var data = JSON.stringify(convArr);
            console.log(convArr.length)
            var config = {
                method: 'post',
                url: 'https://script.google.com/macros/s/AKfycbw9OYAd3AQd4IBPBjpWovKVbUJwUrnnUSmAZlNNAGwNbaCgMKODo9iFAN_AADMAUZvh/exec?gid=377807407',
                headers: {
                'Content-Type': 'application/json'
                },
                data: data
            };
            await doc.useServiceAccountAuth({
                client_email: CREDENTIALS.client_email,
                private_key: CREDENTIALS.private_key
              });
          
              // load the documents info
              await doc.loadInfo();
              const sheet = await doc.sheetsByTitle['History'];
              console.log(sheet.title);
              await sheet.addRows(convArr)
            axios(config)
            .then(function (response) {
            console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
            console.log(error);
            });
        }
        async function saveTests(){
          jsonfile.writeFile(file1, tests)
          .then(res => {
            console.log('Write complete')
          })
          .catch(error => console.error(error))

        }
        
        try {
            await runBackup()
            .then(async()=>{
                //await pushData()
                await browser.close()
            })
            //
            //await saveTests()
        } catch (error) {
            console.log(error)
            //await pushData()
        }
        // await pushData()
        // .then(async()=>{await browser.close()})
        
        

    } catch (error) {

        done = false;
    }

}

app.post("/api", async(req, res) => {
    let dt = req.body;
    //console.log(req.body)
    allAgentsL = dt.agents;
    startDate = dt.startDate;
    endDate = dt.endDate;
    numOfConv = dt.lastRow;
    convNum += dt.numOfConv;
    res.status(200).json({
        message: "Hello World!"
    });
    await run()
});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});