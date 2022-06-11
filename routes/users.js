var express = require('express');
const bodyParser= require('body-parser');
const User =require('../models/user');
var passport = require('passport');
var router = express.Router();
var authenticate=require('../authenticate');
const cors = require('./cors');

router.use(bodyParser.json());

//for all end point under user
router.all('*',cors.corsWithOptions,(req,res)=>{
  res.sendStatus(200);
})
/* GET users listing. */
router.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin, function(req, res, next) {
  User.find({})
  .then((users)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','apolication/json');
    res.json(users);
  })
 // res.send('respond with a resource');

});

router.post('/signup', cors.corsWithOptions, (req,res,next)=>{
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
//we will modify these to return a meaningful message for the user
router.post('/login' ,cors.corsWithOptions, (req,res,next)=>{
  //info is more information about the returned value when it's user
  passport.authenticate('local',(err,user,info)=>{
    //if there is error for any reson happen
    if(err)
      return next(err)
    //if the user doesn't exist (null) means not authenicated
    //the info will carry the information about what happen and why there no user
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type','apolication/json');
      res.json({success:false , Status:'Login unsuccuessfull' ,err:info});
    }
    //if we reach this point so the user is authenticated and add this method(login)
    // for the request message
    req.logIn( user, (err)=>
    {
      if(err)
      {
        res.statusCode = 401;
        res.setHeader('Content-Type','apolication/json');
        res.json({success:false , Status:'Login unsuccuessfull' ,err:"could not login User !"});
      }
    //after signed in create the token
      var token = authenticate.getToken({_id:req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type','apolication/json');
      res.json({success:true ,token:token, Status:'Login succuessfully'});
    });
  })(req,res,next);//this is her style in writing 
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
//if we call passport.authenticate('facebook-token') then it will load user for the request
router.get('/facebook/token',passport.authenticate('facebook-token'),
  (req,res)=>{
    if(req.user){
      //generate the token using req.user._id and store in token variable
      var token = authenticate.getToken({_id:req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type','apolication/json');
      //pass the token to the reply message to the client
      res.json({success:true ,token: token , Status:'Login succuessfully With Facebook'});
    }
})
//to verify the expire time of the token
router.get('/checkJWTToken',cors.corsWithOptions,(req,res,next)=>{
    passport.authenticate('jwt',{session:false},(err,user,info)=>{
      if(err){
        return next(err);
      }
      else if(!user){//not a user
        res.statusCode = 401;//unautherized
        res.setHeader('Content-Type','apolication/json');
        return res.json({success:false  , Status:'JWT invalid!', err:info});
      }
      else{
        res.statusCode = 200;
        res.setHeader('Content-Type','apolication/json');
        //pass the token to the reply message to the client
        return res.json({success:true , Status:'JWT valid',user:uer});
      }
    })(req,res,next);
})
module.exports = router;

