var express = require('express');
const bodyParser= require('body-parser');
const User =require('../models/user');
var passport = require('passport');
var router = express.Router();
var authenicate=require('../authenticate');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup' , (req,res,next)=>{
  //register is from passport-local-mongoose
  //take 3 argument (new user uername , password , callback)
  User.register( new User({username:req.body.username}),
  req.body.password,(err,user)=>{
    if(err){
      //in case of error
      err.statusCode = 500; //unexpected error prevent complete the request
      res.setHeader('Content-Type','apolication/json');
      res.json({err :err});
    }
    else{
      if(req.body.firstname)
        user.firstname=req.body.firstname;
      if(req.body.lastname)
      user.lastname=req.body.lastname;
      //in case regestration done
      //passport.authenticate(type of the strategy)
      user.save((err,user)=>{
        if(err){
          err.statusCode = 500; //unexpected error prevent complete the request
          res.setHeader('Content-Type','apolication/json');
          res.json({err :err});
          return ;
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','apolication/json');
          res.json({success:true , Status:'Regestration succuessfull'});//send to the client
        });
      });
    }
  });
});

router.post('/login' ,passport.authenticate('local') , (req,res)=>{
  //after signed in create the token
  var token = authenicate.getToken({_id:req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','apolication/json');
  //pass the token to the reply message to the client
  res.json({success:true ,token: token , Status:'Login succuessfully'});
});
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;
