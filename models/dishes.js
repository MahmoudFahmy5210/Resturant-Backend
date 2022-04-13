const mongoose = require('mongoose');   
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
//add commentSchema
const commentSchema = new Schema({
    rating : {
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type: String,
        required:true 
    },
    author:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User'
    },
}
,{
    timestamps:true
}
)
//that means every dish can have multiple comments , aslo this how
// document can contain sub document
const dishSchema = new Schema(
{
    name :{
        type: String,
        required:true,
        unique:true
    },
    description :{
        type:String,
        required:true
    },
    image :{
        type:String,
        required:true
    },
    category :{
        type:String,
        required:true
    },
    label :{
        type:String,
        default:''
    },
    price :{
        type:Currency,
        required:true,
        min:0
    },
    featured :{
        type:Boolean,
        required:false
    },
    comments:[commentSchema]
},
    {
        timestamps:true
    
    }
);
//models :The first argument is the singular name of the collection your model is for.
var Dishes = mongoose.model('Dish', dishSchema);

 
module.exports = Dishes;