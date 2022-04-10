var passport = require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
/*
Passport uses serializeUser function to persist user data (after successful authentication) into session. 
Function deserializeUser is used to retrieve user data from session
*/
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());