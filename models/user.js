var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, validate: [validator.isEmail, 'invalid email']},
    password: {type: String, required: true},
    profilePicture: {type: String, required: true, default: '/images/Default_Portrait.png'},
    redcoins: {type: Number, required: true, default: 0}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
