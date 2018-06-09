//require dependencies
var express = require("express");

//set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

//instantiate express App
var app = express();

//set up an express router
var router = express.Router();

//designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

//have every requerst go through our router middleware
app.use(router); 

//listen on port
app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});