const mongoose = require('mongoose');
const participantList = new mongoose.Schema({
    EmailId:{
        type: String,
        required: true,
        unique: true
    },
    userName:{
        type: String,
        required: true
    },
    meetID:{
        type: String,
        required: true
    }
})
const Part = mongoose.model('part', participantList);
module.exports = Part;