var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');



var replyimageSchema = mongoose.Schema({
    replyid: {type: String, required: true},
    filepath: {type: String, required: true},
    timestamp: {type: Date, default: Date.now(), required: true},
    creator: {type: String, required: true},
});//#endregion



module.exports = mongoose.model('ReplyImage', replyimageSchema);