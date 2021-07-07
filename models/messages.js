const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    meetID:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    }
})
const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;