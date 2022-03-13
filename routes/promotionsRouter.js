const express = require('express');
const bodyParser=require('body-parser');
const promotionRouter = express.Router();
const mongoose=require('mongoose');
const Promotions=require('../models/promotions');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((req,res,next)=>{
    Promotions.find({})
    .then((promotions)=>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','applications/json');
        res.json(promotions);
    },err=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
})
.post((req,res,next)=>{
    Promotions.create(req.body)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','applications/json');
        res.json(promo);
    },err=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
})
.put((req,res,next)=>{
    //not supported because it must update spacific promotion
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /promotions');
})
.delete((req,res,next)=>{
    Promotions.remove()
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','applications/json');
        res.json(resp);
    },err=>{
        next(err)
    })
    .catch((err)=>{
        next(err);
    })
});
//__________________________WITH ID
promotionRouter.route('/:promotionId')
.get((req,res,next)=>{

    Promotions.findById(req.params.promotionId)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','applications/json');
        res.json(promo);
    },err=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
})
.post((req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /promotions');
})
.put((req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promotionId,{
        $set:req.body
    },{ new : true })
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','applications/json');
        res.json(promo);
    },err=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
})
.delete((req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','applications/json');
        res.json(resp);
    },err=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
});

module.exports =promotionRouter;
