var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, validate: [validator.isEmail, 'invalid email']},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);
