const { model } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    image:{
        type:String,
        required:true 
    },
    label:{
        type:String,
        default:''
    },
    description:{
        type:String,
        required:true 
    },
    featured:{
        type:Boolean,
        required:false
    },
    price:{
        type:Currency,
        required:true,
        min:0
    }
},
{
    timestamps:true 
}
);

var Promotions = mongoose.model('Promotion',promotionSchema);

//pass value to property
module.exports= Promotions;