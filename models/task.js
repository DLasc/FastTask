var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');



var taskSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    timestamp: {type: Date, default: Date.now(), required: true},
    creator: {type: String, required: true},
    creatorId: {type: String, required: true},
    active: {type: Boolean, required: true, default: true},
    value: {type: Number, required: true, default: 0},
    
});//#endregion

taskSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Task', taskSchema);