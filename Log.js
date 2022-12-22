const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    CallTime:{
        type: String,
        unique: false,
        required: false
    },
    Conversations:{
        type: String,
        unique: false,
        required: false
    },
    LastIteration:{
        type: String,
        unique: false,
        required: true
    },
    Iterations:{
        type: Number,
        required: false
    },
    PhoneNumber:{
        type: String,
        required: false
    },
    CustomerName:{
        type: String,
        unique: false,
        required: false
    },
    SMSNumber:{
        type: String,
        unique: false,
        required: false
    },
    IsBooking:{
        type: Boolean,
        required: false
    },
    IterationsExceeded:{
        type: Boolean,
        unique: false,
        required: false
    },
    WebhookStatus:{
        type: String,
        unique: false,
        required: false
    },
    Time:{
        type: Number,
        unique: false,
        required: false
    },
    Action:{
        type: String,
        unique: false,
        required: false
    },
    Intent:{
        type: String,
        unique: false,
        required: false
    },
    WebhookUsed:{
        type: String,
        unique: false,
        required: false
    },
    isFallback:{
        type: Boolean,
        unique: false,
        required: false
    },
    Agent:{
        type: String,
        unique: false,
        required: false
    },
    Type:{
        type: String
    },
    WebhookObject:{
        type: Object
    },
    UserSays:[{
        type: String
    }],
    BotSays:[{
        type: String
    }]
});

const Log = mongoose.model('log', LogSchema);
module.exports = Log;