var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, index: true, unique: true, required: true},
  password: {type: String, required: true}
}, {collection: 'user'});

userSchema.plugin(uniqueValidator);

var User = mongoose.model('user', userDataSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FastTask' });
});
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next){

  user = new User({username: req.body.uname, email: req.body.email
                    password: req.body.password});
  user.save(function(err, user){
    if (err) return console.error(err);
  })
});

router.post('/login', function(req, res, next){
  console.log(req.body.uname);
  console.log(req.body.password);
});


router.get('/test/:id', function(req, res, next) {
  res.render('test', { title: 'Testing', output: req.params.id});
});

module.exports = router;
