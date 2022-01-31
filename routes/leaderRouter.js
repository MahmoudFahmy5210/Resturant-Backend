const express = require('express');
const bodyParser=require('body-parser');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
    //this code will apply for all method (as a common steps)
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('we will send you leaderes soon!');
})
.post((req,res,next)=>{
    //req.body is came from body parser which parse the incoming request only the json part in the body
    res.end('will add leaderes: '+req.body.name +' it\' description is '+ req.body.description);
})
.put((req,res,next)=>{
    //not supported because it must update spacific leader
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /leaderes');
})
.delete((req,res,next)=>{
    // but this is dangrous operation you must to authurized who do this
    res.end('we will delete all the leaderes now for you!');
});

//__________________________WITH ID
leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    res.end('we will send you the details of '+ req.params.leaderId+' to you');
})
.post((req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /leaderes');})
.put((req,res,next)=>{
    res.write('Updating this leader' +req.params.leaderId + '\n');//used to print line first
    res.end('will updating the leader '+req.body.name+'with details '+
    req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting the leader : '+req.params.leaderId);
});

module.exports =leaderRouter;
