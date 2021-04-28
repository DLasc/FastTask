const { assert } = require('console');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
var Schema = mongoose.Schema;
var Task = require('../models/task')


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  Task.find({active: true}).sort({timestamp: -1}).limit(50).lean().exec()
  .then(result => {
    res.render('index', { title: 'FastTask', tasks: result });
  })
  
});

router.get('/index', function(req, res, next) {
  res.redirect('/')
  // res.render('index', { title: 'FastTask' });
});


module.exports = router;
