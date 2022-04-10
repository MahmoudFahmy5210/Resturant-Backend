var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore= require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//____________________________________
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promotionsRouter');
var leaderRouter = require('./routes/leaderRouter');
//__________________________________
//connecting to database mongoose
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) =>{
  console.log('Connected to the database');
},(err)=>{
  console.log(err);
})

var app = express();


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
app.use(session({
  name:'session-id',
  secret:'12345-67890-12345-67890',
  saveUninitialized:false,
  resave:false,
  store:new FileStore()
}));
/** 
 * if user logged in (visit login end point) passport authenicate.local is called then add a
 * property called user (req.user) in the message request , then passport session automatically
 * serialize the user by storing it's data in session
 * and if any incoming request come agaim the user data will required from the session
 * without new login
 */
app.use(passport.initialize());
app.use(passport.session());

//users are able to ask to access the home page or the user page 
//but if any one ask to go dishes or such that i will ask him for username and password 
app.use('/', indexRouter);//the main page
app.use('/users', usersRouter);//signUp and Login

function auth(req,res,next){
//if there is a property called user in the req message so 
//the user is already authenticated
  if(!req.user){//if the guest is the first time here
    //now the guest is new so the property user is null
    var err = new Error('You are not authenticated');
    err.status=403;//forbidden
    return next(err);//this will skip all the next middlesware and go to error handler func
  }
  else{//if the guest is popular for us and it's info is correct
    next();
  }
}

app.use(auth);
//before sending the client any static files(view html or react ..etc)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders',leaderRouter);
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
