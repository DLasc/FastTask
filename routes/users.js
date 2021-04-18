var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var uniqueValidator = require('mongoose-unique-validator');
// var jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
var User = require('../models/user');
const { rawListeners } = require('../app');
const e = require('express');
var Task = require('../models/task');



// var isAuth = function(req, res, next){
//   if(req.session.isAuth){
//     next();
//   } else{
//     res.redirect('/login')
//   }
// }

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/login', function (req, res, next) {
  res.render('users/login');
});

router.get('/signup', function (req, res, next) {
  res.render('users/signup');
});

router.post('/signup', function (req, res, next) {
  if (req.body.password !== req.body.cpassword) {
    console.error('password and confirm password not the same')
  }
  else if (req.body.password.length < 4) {
    console.error('password too short');
  }

  else {

    bcrypt.hash(req.body.password, 10, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        var user = new User({
          username: req.body.uname,
          email: req.body.email,
          password: result
        });
        user.save()
          .then(result => {
            req.session.isAuth = true;
            req.session.user = user;
            res.redirect('/tasks');
          }
          )
          .catch((err) => console.log(err));

      }
    });
  }


});


router.post('/login', function (req, res, next) {



  User.find({ username: req.body.uname })
    .exec()
    .then(user => {
      if (user.length < 1) {
        console.log("no user found");
      }
      else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            if (result) {
              req.session.isAuth = true;
              req.session.user = user[0];
              res.redirect('/tasks');
              // jwt.sign({email: user[0].email, 
              // userId: user[0]._id});
            }
          }

        })
      }

    })
    .catch()



});

router.post('/logout', function (req, res, next) {
  req.session.isAuth = false;
  req.session.username = null;
  console.log(req);
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });


});


router.get('/:user', function (req, res, next) {

  User.find({ username: req.params.user }).lean()
    .exec()
    .then(result => {
      console.log(result[0]);
      Task.find({ creatorId: result[0]._id }).sort({ timestamp: -1 }).lean()
        .exec()
        .then(tasks => {
          console.log(tasks);
          // res.render('tasks', {tasks: tasks}) 
          res.render('users/show', { title: 'Profile', user: result[0], tasks: tasks });
        }
        )
        .catch(err =>
          console.log(err)
        )

    })
    .catch(err =>
      console.log(err)
    )

});

router.get('/test/:id', function (req, res, next) {
  res.render('test', { title: 'Testing', output: req.params.id });
});
module.exports = router;
