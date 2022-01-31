const express = require('express');
const bodyParser=require('body-parser');
const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req,res,next)=>{
    //this code will apply for all method (as a common steps)
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('we will send you promotions soon!');
})
.post((req,res,next)=>{
    //req.body is came from body parser which parse the incoming request only the json part in the body
    res.end('will add promotions: '+req.body.name +' it\' description is '+ req.body.description);
})
.put((req,res,next)=>{
    //not supported because it must update spacific promotion
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /promotions');
})
.delete((req,res,next)=>{
    // but this is dangrous operation you must to authurized who do this
    res.end('we will delete all the promotions now for you!');
});

//__________________________WITH ID
promotionRouter.route('/:promotionId')
.get((req,res,next)=>{
    res.end('we will send you the details of '+ req.params.promotionId+' to you');
})
.post((req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /promotions');})
.put((req,res,next)=>{
    res.write('Updating this promotion' +req.params.promotionId + '\n');//used to print line first
    res.end('will updating the promotion '+req.body.name+'with details '+
    req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting the promotion : '+req.params.promotionId);
});

module.exports =promotionRouter;
