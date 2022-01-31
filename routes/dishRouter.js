const express = require('express');
const bodyParser=require('body-parser');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next)=>{
    //this code will apply for all method (as a common steps)
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('we will send you dishes soon!');
})
.post((req,res,next)=>{
    //req.body is came from body parser which parse the incoming request only the json part in the body
    res.end('will add dishes: '+req.body.name +' it\' description is '+ req.body.description);
})
.put((req,res,next)=>{
    //not supported because it must update spacific dish
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next)=>{
    // but this is dangrous operation you must to authurized who do this
    res.end('we will delete all the dishes now for you!');
});

//__________________________WITH ID
dishRouter.route('/:dishId')
.get((req,res,next)=>{
    res.end('we will send you the details of '+ req.params.dishId+' to you');
})
.post((req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /dishes');})
.put((req,res,next)=>{
    res.write('Updating this dish' +req.params.dishId + '\n');//used to print line first
    res.end('will updating the dish '+req.body.name+'with details '+
    req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting the dish : '+req.params.dishId);
});

module.exports =dishRouter;
