const express = require('express');
const bodyParser=require('body-parser');
const dishRouter = express.Router();
var authenticate = require('../authenticate');
const cors = require('./cors');

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
//options request
//set the header response
// HTTP status code to statusCode and send its string representation as the response body.
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next)=>{
    //get for me all dishes
    Dishes.find(req.query)
    .populate('comments.author')//get from user model to dishes
    .then((dishes)=>{
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(dishes);//take the parameter and send it back as json response to server
        //we will put this in the body of the reply message

    },(err)=>next(err))
    .catch((err)=>next(err)) // here we collect error to the overall error of the requeses
})
//verify user before do any thing , then verify admin , it must pass the two verification 
//else it will send back error 
.post(cors.corsWithOptions,authenticate.verifyUser , authenticate.verfiyAdmin,(req,res,next)=>{
    //req.body is came from body parser which parse the incoming request only the json part in the body
    Dishes.create(req.body)//return dish promise
    .then((dish)=>{
        console.log('Dish created =',dish);
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
    //not supported because it must update spacific dish
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.remove({}) 
    .then((resp)=>{
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});

//__________________________WITH ID
dishRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        console.log('Dish created =',dish);
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err))
     
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verfiyAdmin, (req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /dishes');})
.put( cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin , (req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{ new : true })
    .then((dish)=>{
        console.log('Dish created =',dish);
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verfiyAdmin,(req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        //console.log('Dish created =',dish);
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});
//_____________________________________________comments


module.exports =dishRouter;
