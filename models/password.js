var mongoose = require('mongoose');
var validator = require('validator');

var passwordSchema = mongoose.Schema({
    password: {type: String, required: true, unique: true},
    ownerid: {type: String, required: true},
});


module.exports = mongoose.model('Password', passwordSchema);
