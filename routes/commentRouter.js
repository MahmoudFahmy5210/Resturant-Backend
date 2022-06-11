const express = require('express');
const bodyParser=require('body-parser');
const commentRouter = express.Router();
var authenticate = require('../authenticate');
const cors = require('./cors');
const Comments = require('../models/Comments');

commentRouter.use(bodyParser.json());

commentRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
     //get for me all Comments comment , available for only users
    Comments.find(req.query)
    .populate('author')//the name of the field in database
    .then((comments)=>{
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(comments);
    },(err)=>next(err))
    .catch((err)=>next(err)) // here we collect error to the overall error of the requeses
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    if(req.body !=null){
        req.body.author=req.user._id;//it will add property called user for req.body
        Comments.create(req.body)
            .then((comment)=>{
                Comments.findById(comment._id)
                .populate('author')
                .then((comment)=>{
                    res.statusCode=200 //say all are good
                    res.setHeader('Content-Type','application/json');//since we work on json
                    res.json(comment);  
                })                    
                },(err)=>next(err))
                .catch((err)=>{
                    next(err);
                })
    }
    else
    {
//this will return the error for the error handling message which in app.js 
    err = new Error('The comment'+ req.body+'is not found in the request body');
    err.status=404;
    return next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=>{
    //not supported because it must update spacific comment
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /comments');
})
//delete all comments by admin
.delete( cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin,
(req,res,next)=>
{
    Comments.remove({})
    .then((resp)=>{
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});


//__________________________WITH ID
commentRouter.route('/:commentId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser,(req,res,next)=>{
    Comments.findById(req.params.commentId)
    .populate('author')
    .then((comment)=>{
        if(comment != null){
            res.statusCode=200 //say all are good
            res.setHeader('Content-Type','application/json');//since we work on json
            res.json(comment);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post( cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /CommentId'+req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=>{
    Comments.findById(req.params.commentId)
    .then((comment)=>{
        if(comment != null )
        {
            if(!comment.author.equals(req.user._id)){
                err = new Error('you are not authorized to do this operation');
                err.status=401;
                return next(err);
            }
            //because we update with body overall not field by field
            req.body.author = req.user._id;
            /**By default, findOneAndUpdate() returns the document as it was before update was applied.
             * If you set new: true, findOneAndUpdate() 
             * will instead give you the object after update was applied. */
            Comments.findByIdAndUpdate(req.params.commentId,{
                $set:req.body } , {new:true} )
            .then((comment)=>{
                Comments.findById(comment._id)
                .populate('author')
                .then((comment)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment);
                }) 
            },err=>{
                next(err);
            })
        }
        else
        {
            //this will return the error for the error handling message which in app.js 
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err); 
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Comments.findById(req.params.commentId)
    .then((comment)=>{
        if(comment != null ) 
        {
            if(!comment.author.equals(req.user._id)){
                err = new Error('you are not authorized to delete this comment');
                err.status=401;
                return next(err);
            }
            Comments.findByIdAndRemove(req.params.commentId) 
            .then((resp)=>{
                    res.statusCode=200 //say all are good
                    res.setHeader('Content-Type','application/json');//since we work on json
                    res.json(resp);
                },(err)=>next(err))
                .catch((err)=>{
                    next(err);
                });    
        }
        else
        {
            err = new Error('The comment'+ req.params.commentId+'is not found');
            err.status=404;
            return next(err);   
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
});

module.exports =commentRouter;
