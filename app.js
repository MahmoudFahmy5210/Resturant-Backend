var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore= require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
//____________________________________
var config = require('./config');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promotionsRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');



//__________________________________
//connecting to database mongoose
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = config.mongoUrl;//more organized code
const connect = mongoose.connect(url);

connect.then((db) =>{
  console.log('Connected to the database');
},(err)=>{
  console.log(err);
})

var app = express();
// * means any incoming request
// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);//307 is status code
  }
});


// view engine setup
//set(name,value)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//use is an application-middleware func
//Using app.use() means that this middleware will be called for every call to the application.
//Mounts the specified middleware function or functions at the specified path: 
//the middleware function is executed when the base of the requested path matches path.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-12345-67890'));//this string called the secret

//when this called ?? called passport.authenticate whenever the code
app.use(passport.initialize());


//users are able to ask to access the home page or the user page 
//but if any one ask to go dishes or such that i will ask him for username and password 
app.use('/', indexRouter);//the main page
app.use('/users', usersRouter);//signUp and Login




//before sending the client any static files(view html or react ..etc)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders',leaderRouter);
app.use('/upload',uploadRouter);

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
