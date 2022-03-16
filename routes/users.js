var express = require('express');
const bodyParser= require('body-parser');
const User =require('../models/user');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup' , (req,res,next)=>{
  User.findOne({username:req.body.username})
  .then((user)=>{
    if(user != null){
      var err = new Error("User "+req.body.username +" is already exist !");
      err.status = 403; 
      next(err);
    }
    else{
      return User.create({
        username:req.body.username,
        password:req.body.password
      })
    }
  })
  .then((user)=>{
    res.statusCode = 201;//created
    res.setHeader('Content-Type','apolication/json');
    res.json({Status :'Registeration is succuess',user:user});
  },err=>{
    next(err);
  })
  .catch((err)=>{
    next(err);
  })
})

router.post('/login' , (req,res,next)=>{
  var authHeader = req.headers.authorization;
  if(!req.session.user){//if the guest is the first time here
    /*now the guest is new so the property user is null
    */
    if(authHeader == null){//now check if he enter the user name and password correct
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate','Basic');
      err.status=401;
      return next(err)//this will skip all the next middlesware and go to error handler func
    }
    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    User.findOne({username:req.body.username})
    .then((user)=>{
    if(user === null){
      var err = new Error("User "+req.body.username +" is not exist !");
      err.statusCode=403//Doesn't exist 
      return next(err); 
    }
    else if(user.password !== req.body.password){
      var err = new Error("Password "+req.body.password +" is incorrect !");
      err.statusCode=403//unthorized 
      return next(err); 
    }
    else if(user.username === username && user.password === password){
      req.session.user="Authunticated";
      res.statusCode = 200;
      res.setHeader('Content-Type' , "text/plain");
      res.end('You are authenticated');
    }
  })
  .catch((err)=>{
    next(err);
  })
}
else{
  res.statusCode = 200;
  res.setHeader('Content-Type' , "text/plain");
  res.end('You are already authenticated');
  }
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
