var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
// var expressValidator = require('express-validator');
var expressSession = require('express-session');
var MongoDBSession = require('connect-mongodb-session')(expressSession);




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'supersecret', saveUninitialized: false, resave: false, store: store}));


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
