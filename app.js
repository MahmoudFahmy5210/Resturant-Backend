var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
//use is an application-middleware func
//Using app.use() means that this middleware will be called for every call to the application.
//Mounts the specified middleware function or functions at the specified path: 
//the middleware function is executed when the base of the requested path matches path.
app.use('/dishes',dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders',leaderRouter);

// view engine setup
//set(name,value)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function auth(req,res,next){
  console.log(req.headers);
  var authHeader = req.headers.authorization;
  if(authHeader == null){
    var err = new Error('You are not authenticated');
    res.setHeader('WWW-Authenticate','Basic');
    err.status=401;
    return next(err)//this will skip all the next middlesware and go to error handler func
  }
  var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
  var username = auth[0];
  var password = auth[1];
  if(username ==='admin' && password === 'password'){
    next();//authorized
  }else{
    var err = new Error('You are not authenticated');
    res.setHeader('WWW-Authenticate','Basic');
    err.status=401;
    return next(err)
  }

}

app.use(auth);
//before sending the client any static files(view html or react ..etc)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
