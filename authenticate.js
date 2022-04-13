var passport = require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User = require('./models/user');
//import the new strategy
var JwtStrategy = require('passport-jwt').Strategy;
var JwtExtract = require('passport-jwt').ExtractJwt;
var Jwt = require('jsonwebtoken');//used to create,sign,and verify token
var config = require('./config'); 
const { ExtractJwt, Strategy } = require('passport-jwt');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
/*
Passport uses serializeUser function to persist user data (after successful authentication) into session. 
Function deserializeUser is used to retrieve user data from session
*/
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//function to create the token
//user is json object
//this func used to sign the token with the secret key(created in the server)
exports.getToken = function (user){
    return Jwt.sign(user,config.secretKey , 
     {expiresIn:3600});
     //return JSON web token string
}
//object option
var opts={};
//specify how the token get from request
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey= config.secretKey;
                        
//JwtStrategy take (strategy option for extracting token , verify callback)
//this part used to extract the token and ensure that there is id in database for these user
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload , done)=>{
        console.log("jwtPayload " , jwt_payload);
        
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null , user);
            }
            else{
                return(null,false);
            }
        });
    }));

//exports make the property avalible when import in another file
//you have to set session to be false because if not , passport auth will try to use it
exports.verifyUser=passport.authenticate('jwt',{session:false});  
