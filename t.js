const moment = require('moment');
let a = 'Nov 3, 12:57 PM'
let b = a.split(' ')
let c = b[1].trim()
// remove comma from string
let d = c.replace(',', '')
console.log(d)