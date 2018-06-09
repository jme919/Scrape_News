//bring in scrape function
var scrape = require("../scripts/scrape");

//bring in headlines and notes from the controller
var headlinesController = require("..controllers/headlines");
var notesController = require("../controllers.notes");






module.exports = function(router) {
    //this route render the homepage
    router.get("/", function(req,res){
        res.render("home");
    });

    //this route renders the saved handlebars page
    router.get("/saved", function(req, res){
        res.render("saved");

    });
    
    router.get("/api/fetch", function(req, res){
        headlinesController.fetch(function(err, docs){
            if(!docs || docs.insertedCount === 0){
                res.json({
                    message: "No new articles right now, check back later!"
                });
            }
            else{
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });
    router.get("/api/headlines", function(req, res){
        var query = {};
        if (req.query.saved){
            query = req.query;
        }
        headlinesController.get(query, function(data){
            res.json(data);
        });
    });
}