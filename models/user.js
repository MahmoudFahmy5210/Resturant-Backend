const { model } = require('mongoose');
const mongoose = require('mongoose');
const Schema =mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    firstname:{
        type:String,
        defulat:''
    },
    lastname:{
        type:String,
        defulat:''
    },
    facebookId:String,
    admin:{
        type:Boolean,
        default:false 
    }
    
});
//plugin is function in mongoose
//passportLocalMongoose is a plugin used to automatically create username and password field
// that are safed from any one
User.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",User);