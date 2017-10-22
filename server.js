var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var request = require('request');
// var logger = require('morgan');
var mongoose = require('mongoose');
var cheerio = require('cheerio');

///Config server connection
var app = express();
var PORT = process.env.PORT || 3000;

///body parser preparations
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());


app.use(express.static('public'));

//Handlebars config
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/nyArticlesdb", {
  useMongoClient: true
});

///require models
var db = require("./models");
////Routes////////////


app.get('/', function (req, res) {
    db.Article.find()
        .then(function(data){
            res.render('index', {scrapedArticles: data});
        })
        .catch(function(err){
            res.send(err);
        })
    
});


app.get('/saved', function (req, res) {
    db.SavedArticle.find()
    .then(function(data){
        res.render('saved', {savedArticles: data});
    })
    .catch(function(err){
        res.send(err);
    })
});

app.get('/scrape', function (req, res) {
    
    request("http://www.nytimes.com/", function(err, response, body){

        var $ = cheerio.load(body)
        //article.story.story-heading.a, text --> title  
         //article.story.story-heading.a , href -->link 
        //article.story.summary
        var results = [];

        //$("div.story").each(function(i, element){
        $("article.story").each(function(i, element){
            var result = {};
            //result.title = $(element).children("h3").children("a").text();
            result.title = $(element).children("h2").children("a").text();
            
            result.link = $(element).children("h2").children("a").attr("href");            
            result.summary= $(element).children("p.summary").text();


            db.Article
            .create(result)
            .then(function(dbArticle) {
              // If we were able to successfully scrape and save an Article, send a message to the client
              res.send("Scrape Complete");
            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              res.json(err);
            });
        
        });
    });
});

app.post('/saved-articles/:id', function(req, res){
    ///add article to the saved articles table
    db.SavedArticle
    .create(req.body)
    .then(function(dbArticle) {
        //remove article from the scraped articles table
        db.Article
        .remove({_id: req.params.id})
        .then(function(data){
            res.send('done');
        })
        .catch(function(err){
            res.send(err);
        })
    })
    .catch(function(err) {
      res.json(err);
    });
})

app.get('/saved-articles/:id', function(req, res){
    db.SavedArticle
    .remove({_id: req.params.id})
    .then(function(dbArticle) {
      res.send('done');
    })
    .catch(function(err) {
      res.json(err);
    });
})
 
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });