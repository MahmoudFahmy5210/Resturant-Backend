const express = require('express');
const bodyParser=require('body-parser');
const dishRouter = express.Router();

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next)=>{
    //get for me all dishes
    Dishes.find({})//return promise with all dishes
    .then((dishes)=>{
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(dishes);//take the parameter and send it back as json response to server
        //we will put this in the body of the reply message

    },(err)=>next(err))
    .catch((err)=>next(err)) // here we collect error to the overall error of the requeses
})
.post((req,res,next)=>{
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
.put((req,res,next)=>{
    //not supported because it must update spacific dish
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next)=>{
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
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        console.log('Dish created =',dish);
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err))
     
})
.post((req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /dishes');})
.put((req,res,next)=>{
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
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        console.log('Dish created =',dish);
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});

module.exports =dishRouter;
