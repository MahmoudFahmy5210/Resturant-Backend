const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage(
    {
    destination: (req,file,cb) =>
    {//error , filedestination
        cb(null,'public/images');
    },
    filename :(req,file,cb) =>{
        cb(null,file.originalname);
    }
});
const imageFileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)){
        return cb( new Error("you can only upload image files only "),false);
    }
    cb(null,true);
};

const upload = multer({storage:storage,fileFilter:imageFileFilter});

const uploadRouter =express.Router();  

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next)=>{
        res.statusCode=403 //not found
        res.end("GET operation is not allowed for /imageUpload");
    }
)  
.post(cors.corsWithOptions,authenticate.verifyUser , authenticate.verfiyAdmin,
    upload.single('imageFile'),
    (req,res)=>{
        res.statusCode=200 //say all are good
        res.setHeader('Content-Type','application/json');//since we work on json
        res.json(req.file);//contain the file path
    }
)
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verfiyAdmin,
    (req,res,next)=>{
    //not supported because it must update spacific dish
    res.statusCode =403 // means operation not supported
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode =403 // means operation not supported
    res.end('DELETE operation not supported on /imageUpload');
    }
);

module.exports = uploadRouter; 
