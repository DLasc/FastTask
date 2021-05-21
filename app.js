var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
// var expressValidator = require('express-validator');
var expressSession = require('express-session');
var MongoDBSession = require('connect-mongodb-session')(expressSession);
var request = require('supertest');
var Reply = require('./models/reply')
var Task = require('./models/task')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');
const user = require('./models/user');

var app = express();


var store = new MongoDBSession({
  url: 'mongodb://localhost:27017/test',
  collection: "mySessions",
});
// view engine setup
app.engine('hbs', hbs({extname:'hbs',
                  helpers: require('./config/handlebarsHelpers'),
                  defaultLayout: 'layout', 
                  layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(expressValidator());
app.use(cookieParser());
app.use(expressSession({secret: 'supersecret', saveUninitialized: false, resave: false, store: store}));


//SET SOME VARIABLES ON EACH RESPONSE SO NAVBAR VARIABLES ARE ALWAYS AVAILABLE
app.use(function(req, res, next){
  if (req.session.isAuth){
    res.locals.isAuth = true;
    res.locals.user = req.session.user;
  }
  else{
    res.locals.isAuth = false;
  }
  // console.log(res.locals.isAuth);
  next();
})

// ROUTE TO PROTECT PRIVATE IMAGES BEFORE THEY'RE SERVED ASA STATIC RESOURCES
app.use('/images/private/:imgname', function(req, res, next){
  // console.log('In route')
  if (!req.session.isAuth) {
    res.sendStatus(401)
  }
  // console.log(req.path)
  // FIND REPLY WITH IMAGE
  Reply.findOne({active:true, filepath: '/images/private/'+req.params.imgname}).exec()
  .then(result => {
    // console.log(result)
    // MAKE SURE IT'S FIRST REPLY
    Reply.findOne({active: true, replytotask: result.replytotask}).exec()
    .then(firstreply => {
      // console.log(firstreply)
      // console.log(firstreply._id.str === result._id.str)
      if ( firstreply._id.str === result._id.str ){
        //FIND TASK IT'S REPLYING TO TO FIND WHICH USER IS ALLOWED ACCESS
        Task.findOne({_id: result.replytotask}).exec()
        .then(task => {
          if (req.session.user._id.toString() === task.creatorId) {
            console.log("Go ahead!!!")
            next()
          }
           else {
            res.sendStatus(401)
          }
        }).catch(err => {
          console.log(err)
          res.sendStatus(401)
        })
      }
      else {
        res.sendStatus(401)
      }
    })
  
    
    
    
  }).catch(err => {
    console.log(err)
    res.sendStatus(401)
  })
})


app.use(express.static(path.join(__dirname, 'public')));





app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
