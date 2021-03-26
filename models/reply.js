var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');



var replySchema = mongoose.Schema({
    active: {type: Boolean, default:true, required:true},
    replytotask: {type: String, required: true},
    textcontent: {type: String, required: true},
    filepath: {type: String, required: false},
    timestamp: {type: Date, default: Date.now(), required: true},
    creator: {type: String, required: true},
    creatorId: {type: String, required: true}
});//#endregion




module.exports = mongoose.model('Reply', replySchema);