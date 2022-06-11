const express = require('express');
const bodyParser = require('body-parser');
const favoriteRouter  =   express.Router();
var authenticate = require('../authenticate');
const cors = require('./cors');
const mongoose = require('mongoose');
const Favorites = require('../models/favorites');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get((req,res,next)=>{
    Favorites.find(req.user)
    .populate('user')
    .populate('dishes')
    .then((fav)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','Application/json');
        res.json(fav);
    },err=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
})

.post(authenticate.verifyUser,(req,res,next)=>{
    var x= req.body;
    //console.log((arr),"______________id____");
    Favorites.findOne({user : req.user._id})
    .then((fav)=>
    {
        if(fav != null)
        {
            //console.log("iam fav ___",fav," !");
            x.forEach(ele => {
                if(fav.dishes.indexOf(ele._id) == -1){
                    fav.dishes.push(mongoose.Types.ObjectId(ele._id));
                }
                else
                {
                    err = new Error('this dish '+ele._id + ' is already exist');
                    err.status=404;
                    return next(err);
                }
            });
            //fav.dishes.push(arr);
            fav.save()
            //the next modifcation is beacuse react client is expect returning this from us
            .then((fav)=>{
                Favorites.findById(fav._id)
                .populate(fav.user)
                .populate(fav.dishes)
                .then((fav)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','Application/json');
                    res.json(fav);
                })
                
            },err=>{
                next(err);
            })
        }
        else if(fav == null)
        {
            Favorites.create({user :req.user._id})
            .then((fav)=>
            {
                //console.log("iam favv ___",favv," !");    
                x.forEach(ele => {
                    fav.dishes.push(mongoose.Types.ObjectId(ele._id));
                });
                fav.save()
                .then((fav)=>{
                    Favorites.findById(fav._id)
                    .populate(fav.user)
                    .populate(fav.dishes)
                    .then((fav)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','Application/json');
                        res.json(fav);
                    })
                })
            },err=>{
                next(err);
            })
            .catch((err)=> { next(err) ;})
        }
    })
    .catch((err)=>{
        next(err);
    })
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    //var value =req.params.dishId;
    //findone used when we need to search for another field rather id
    Favorites.findOneAndRemove({user:req.user._id})
    .then((fav)=>
    {
        res.sendStatus=200;
        res.setHeader('Content-Type','Application/json');
        res.json(fav);
    },err=>{
        next(err);
    })
    .catch((err)=>
    {
        next(err);
    })
       
});
//_______________________________________ With id
favoriteRouter.route('/:dishId')
.get(authenticate.verifyUser,(req,res,next)=>{
    Favorites.find({user:req.user._id})
    .then((fav)=>{
//in case fav is null
        if(!fav){
            res.statusCode=200;
            res.setHeader("Content-Type","Application/json");
            return res.json({'exist':false},{'favorites':fav});
        }
//in case fav for this user is found but this dish is not found
        else if(fav.dishes.indexOf()<0){
            res.statusCode=200;
            res.setHeader("Content-Type","Application/json");
            return res.json({'exist':false},{'favorites':fav});
        }
        else{
//in case fav for user is found and this dish if found
            res.statusCode=200;
            res.setHeader("Content-Type","Application/json");
            return res.json({'exist':true},{'favorites':fav});    
        }
    },err=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
})
.post(authenticate.verifyUser,(req,res,next)=>{
    //find by user not by the id
    Favorites.findOne({user : req.user._id})
    .then((fav)=>{
        //be sure that the existance of favorite
        if(fav != null)
        {
            //console.log("iam fav ___",fav," !");
            //check that this dish not dubplicate
            if(fav.dishes.indexOf(req.params.dishId) ==-1 )
            {
                //convert to objectId before push to mongo
                fav.dishes.push(mongoose.Types.ObjectId( req.params.dishId));
                fav.save()  
                .then((fav)=>{
                    Favorites.findById(fav._id)
                    .populate(fav.user)
                    .populate(fav.dishes)
                    .then((fav)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','Application/json');
                        res.json(fav);
                    })
                })
            }
            else
            {
                err = new Error("This dish "+req.params.dishId + " is already exist in favorites");
                err.status=404;
                next(err);
            }
            
        }
        else if(fav == null)
        {
            Favorites.create({user :req.user._id})
            .then((fav)=>
            {
                //console.log("iam favv ___",fav," !");
                fav.dishes.push(mongoose.Types.ObjectId( req.params.dishId));
                fav.save()
                .then((fav)=>{
                    Favorites.findById(fav._id)
                    .populate(fav.user)
                    .populate(fav.dishes)
                    .then((fav)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','Application/json');
                        res.json(fav);
                    })
                })
            },err=>{
                next(err);
                console.log(err,"first err");
            })
            .catch((err)=> { next(err) ;})
        }
    })    
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    //findone used when we need to search for another field rather id
    Favorites.findOne({user:req.user._id})
    .then((fav)=>
    {
        //console.log("__________dishes",fav.dishes,"__________dishes");
        var idx = fav.dishes.indexOf(req.params.dishId);//get the element index
        if(idx!= -1)//sure that element is found
        {
            fav.dishes.splice(idx,1);//delete this element
            fav.save()
            .then((fav)=>{
                Favorites.findById(fav._id)
                .populate(fav.user)
                .populate(fav.dishes)
                .then((fav)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','Application/json');
                    res.json(fav);
                })
            })
            .catch((err)=>
            {
                next(err);
            })
        }
        else{
            err = new Error('The comment'+ req.params.dishId+'is not found');
            err.status=404;
            return next(err);   
        }
    })
    .catch((err)=>{
        next(err);
    })
})
module.exports =favoriteRouter;


