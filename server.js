//require dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


//set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

//instantiate express App
var app = express();

//set up an express router
var router = express.Router();

//designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

//connect handlebars
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//use body parser
app.use(bodyParser.urlencoded({
    extended:false
}));

//have every requerst go through our router middleware
app.use(router); 

//if deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect mongoose to our database
mongoose.connect(db, function(error){
    //log errors connecting with mongoose
    if(error){
        console.log(error);
    }    
    //or log a success message
    else{
        console.log("Mongoose connectioin is successful!");
    }
});

//listen on port
app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});