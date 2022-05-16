    const express = require('express');
    const cors = require('cors');
    const app = express();

    //these will contain all the willing request which will be allowed.
    const willingList = ['http://localhost:3000','https://localhost:3433'];
     
/* these func check if the incoming request contain the willing list origin , 
if it's so reply with acesses-control-allow-origin with the origin set in the request header
 */
    var corsOptionDelegate = ( req , callback )=>{
        var corsOptions;
        console.log(req.header('Origin'));
        if(willingList.indexOf(req.header('Origin')) !== -1 ){
            corsOptions ={origin :true};
        }
        else{
            //it means that access-control-origin will not be returned by my server site
            corsOptions ={origin :false};  
        }
        callback(null,corsOptions);
    }
    /*if we write this so we say that access-control-origin:* so we have to 
    pu options to ristrect this operations  */
    exports.cors=cors();
    exports.corsWithOptions=cors(corsOptionDelegate);