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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nyArticlesdb";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

///require models
var db = require("./models");

////Routes////////////

///Root gets all scraped articles
app.get('/', function (req, res) {
    db.Article.find()
        .then(function(data){
            res.render('index', {scrapedArticles: data});
        })
        .catch(function(err){
            res.send(err);
        })
    
});

///get all saved articles
app.get('/saved', function (req, res) {
    db.SavedArticle.find()
    .then(function(data){
        res.render('saved', {savedArticles: data});
    })
    .catch(function(err){
        res.send(err);
    })
});

//scrape articles and save them in the database
app.get('/scrape', function (req, res) {
    
    request("http://www.nytimes.com/", function(err, response, body){

        var $ = cheerio.load(body)

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
              res.send("Scrape Complete");
            })
            .catch(function(err) {
              res.json(err);
            });
        
        });
    });
});

///save selected article
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

///delete save article
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

///get all notes of the selected article
app.get('/saved-notes/:id', function(req, res){

    db.SavedArticle
    .findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
})

///add new note for the selected article
app.post('/saved-notes/:id', function(req, res){

    db.Note
    .create(req.body)
    .then(function(dbNote) {
      return db.SavedArticle.findOneAndUpdate({ _id: req.params.id },
        {$push: {note: dbNote._id }}, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
    
})
 
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });