const express = require('express');
const bodyParser=require('body-parser');
const leaderRouter = express.Router();

const Leaders = require('../models/leaders');
const mongoose = require('mongoose');
var authenticate=require('../authenticate');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next)=>{
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    }, err =>{
        next(err);
    })
    .catch(err=>{
        next(err);
    })
})
.post(authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    }, err =>{
        next(err);
    })
    .catch(err=>{
        next(err);
    })
})

.put(authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
    //not supported because it must update spacific leader
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /leaderes');
})
.delete(authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
    Leaders.remove()
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, err =>{
        next(err);
    })
    .catch(err=>{
        next(err);
    })
});

//__________________________WITH ID
leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        if(leader != null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        }
        else{
            err = new Error('The leader '+ res.params.leaderId + ' not found');
            err.status=404;
            return next(err);
        }
    },err=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })

})
.post(authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /leaderes');
})

.put(authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set :req.body
    },  {new:true})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    }, err =>{
        next(err);
    })
    .catch(err=>{
        next(err);
    })  
})
.delete(authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(resp);
    },err=>{
        next(err);
    })
    .catch((err)=>next(err))
});

module.exports =leaderRouter;
