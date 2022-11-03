const data = require('./trainingData2.json')
const { Classifier } = require('ml-classify-text')
const classifier = new Classifier()
let o1 = []
let o2 = []
let o3 = []
let o4 = []
let o5 = []
let o6 = []
let o7 = []
let o8 = []
let o9 = []
data.forEach(element => {
    let conv = element.TrainingString
    let type = element.Type
    if(type === 'Booking'){
        o1.push(conv)
    }
    if(type === 'Operator'){
        o2.push(conv)
    }
    if(type === 'Cancel'){
        o3.push(conv)
    }
    if(type === 'Reschedule'){
        o4.push(conv)
    }
    if(type === 'Recall'){
        o5.push(conv)
    }
    if(type === 'Status'){
        o6.push(conv)
    }
    if(type === 'Confirm'){
        o7.push(conv)
    }
    if(type === 'Warranty'){
        o8.push(conv)
    }
    if(type === 'Quotation'){
        o9.push(conv)
    }
});

exports.predict = async (str) => {
    classifier.train(o1, 'Booking') 
    classifier.train(o2, 'Operator')
    classifier.train(o3, 'Cancel')
    classifier.train(o4, 'Reschedule')
    classifier.train(o5, 'Recall')
    classifier.train(o6, 'Status')
    classifier.train(o7, 'Confirm')
    classifier.train(o8, 'Warranty')
    classifier.train(o9, 'Quotation')
    let predictions = classifier.predict(str)
  
    return predictions
  }
