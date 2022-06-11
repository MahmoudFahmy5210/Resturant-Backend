const express = require('express');
const bodyParser=require('body-parser');
const promotionRouter = express.Router();
const cors = require('./cors');
const mongoose=require('mongoose');
const Promotions=require('../models/promotions');
var authenticate=require('../authenticate');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next)=>{
    //as we will pass featured:query
    Promotions.find(req.query)
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
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
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
.put( cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin, (req,res,next)=>{
    //not supported because it must update spacific promotion
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /promotions');
})
.delete( cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin, (req,res,next)=>{
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
.get(cors.cors,(req,res,next)=>{

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
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin, (req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('POST operation not supported on /promotions');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin,(req,res,next)=>{
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
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verfiyAdmin, (req,res,next)=>{
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
