const express = require('express');
const bodyParser=require('body-parser');
const dishRouter = express.Router();
var authenicate = require('../authenticate');

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next)=>{
    //get for me all dishes
    Dishes.find({})
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
.post(authenicate.verifyUser , authenicate.verfiyAdmin,(req,res,next)=>{
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
.put(authenicate.verifyUser,authenicate.verfiyAdmin,(req,res,next)=>{
    //not supported because it must update spacific dish
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /dishes');
})
.delete(authenicate.verifyUser,(req,res,next)=>{
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
    .populate('comments.author')
    .then((dish)=>{
        console.log('Dish created =',dish);
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err))
     
})
.post( authenicate.verifyUser,authenicate.verfiyAdmin, (req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /dishes');})
.put( authenicate.verifyUser,authenicate.verfiyAdmin , (req,res,next)=>{
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
.delete( authenicate.verifyUser ,authenicate.verfiyAdmin,(req,res,next)=>{
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

dishRouter.route('/:dishId/comments')
.get(authenicate.verifyUser,(req,res,next)=>{
     //get for me all dishes comment , available for only users
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish != null){
            res.statusCode=200 //say all are good
            res.setHeader('Content-Type','application/json');//since we work on json
            res.json(dish.comments);
        }
        else{
            //this will return the error for the error handling message which in app.js 
            err = new Error('The dish'+ req.params.dishId+'is not found');
            err.status=404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err)) // here we collect error to the overall error of the requeses
})
.post(authenicate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
//since we use verify user , passport-jwt will include user property in the req message so we can get the id
           // console.log('Post comments , request',req.user);
            //console.log('request.body before author ', req.body);

            req.body.author=req.user._id;//it will add property called user for req.body
            //console.log('request.body after', req.body);
            //console.log('request.body.author', req.body.author);
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200 //say all are good
                    res.setHeader('Content-Type','application/json');//since we work on json
                    res.json(dish.comments);   //or dish only 
                })
                
            },(err)=>next(err))
            
        }
        else{
            //this will return the error for the error handling message which in app.js 
            err = new Error('The dish'+ req.params.dishId+'is not found');
            err.status=404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put( authenicate.verifyUser,(req,res,next)=>{
    //not supported because it must update spacific dish
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /dishes'+req.params.dishId+'/comments');
})
.delete( authenicate.verifyUser,authenicate.verfiyAdmin,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
            for( let i = (dish.comments.length) ; i>=0; i-- ){
                //delete each element
                dish.comments.splice(i,1);

            }
            dish.save()
            .then((dish)=>{
                res.statusCode=200 //say all are good
                res.setHeader('Content-Type','application/json');//since we work on json
                res.json(dish.comments);
            })
        }
        else{
            //this will return the error for the error handling message which in app.js 
            err = new Error('The dish'+ req.params.dishId+'is not found');
            err.status=404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
});

//__________________________WITH ID
dishRouter.route('/:dishId/comments/:commentId')
.get(authenicate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentId) !=null){
            res.statusCode=200 //say all are good
            res.setHeader('Content-Type','application/json');//since we work on json
            res.json(dish.comments.id(req.params.commentId));
        }
        else if( dish == null) {
            //this will return the error for the error handling message which in app.js 
            err = new Error('The dish'+ req.params.dishId+'is not found');
            err.status=404;
            return next(err);
        }
        else{
            err = new Error('The comment'+ req.params.commentId+'is not found');
            err.status=404; 
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
     
})
.post( authenicate.verifyUser,(req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /dishes'+req.params.dishId +'/comments/'+req.params.commentId);})
.put( authenicate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentId) !=null && dish.comments.id(req.params.commentId).author.equals(req.user._id) )
        {
            if(req.body.rating){
                //because there is no spacific func to handle these
                dish.comments.id(req.params.commentId).rating=req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment=req.body.comment;
            }
            dish.save()
            .then((dish)=>{
//we search every time to show/populate author
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200 //say all are good
                    res.setHeader('Content-Type','application/json');//since we work on json
                    res.json(dish);
                })
            })
            
        }
        else if( dish==null) {
            //this will return the error for the error handling message which in app.js 
            err = new Error('The dish'+ req.params.dishId+'is not found');
            err.status=404;
            return next(err);
        }
        else if(!dish.comments.id(req.params.commentId).author.equals(req.user._id)){
            err = new Error('you are not authorized to edit this comment');
            err.status=401;
            return next(err);
        }
        else{
            err = new Error('The comment '+ req.params.commentId+'is not found');
            err.status=404; 
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.delete( authenicate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentId) !=null && dish.comments.id(req.params.commentId).author.equals(req.user._id))
        {
            dish.comments.id(req.params.commentId).remove();
            //dish.comments[i]._id.remove();
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200 //say all are good
                    res.setHeader('Content-Type','application/json');//since we work on json
                    res.json(dish);
                })
            },(err)=>next(err))
        }
        else if(dish == null){
            //this will return the error for the error handling message which in app.js 
            err = new Error('The dish'+ req.params.dishId+'is not found');
            err.status=404;
            return next(err);
        }
        else if(!dish.comments.id(req.params.commentId).author.equals(req.user._id)){
            err = new Error('you are not authorized to delete this comment');
            err.status=401;
            return next(err);
        }
        else{
            err = new Error('The comment'+ req.params.commentId+'is not found');
            err.status=404;
            return next(err);   
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
});

module.exports =dishRouter;
