const { assert } = require('console');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
var Schema = mongoose.Schema;


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('index', { title: 'FastTask' });
});

router.get('/index', function(req, res, next) {
  res.redirect('/')
  // res.render('index', { title: 'FastTask' });
});


module.exports = router;
