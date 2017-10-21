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

////cheerio and request
// const cheerio = require('cheerio')
// const $ = cheerio.load('<h2 class="title">Hello world</h2>')
 
// $('h2.title').text('Hello there!')
// $('h2').addClass('welcome')
 
// $.html()
////Routes////////////
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/saved', function (req, res) {
    res.render('saved');
});

app.get('/scrape', function (req, res) {
    
    request("https://www.nytimes.com/", function(err, response, body){

        var $ = cheerio.load(body)
        //article.story.story-heading.a, text --> title  
         //article.story.story-heading.a , href -->link 
        //article.story.summary
        var results = [];

        $("article.story").each(function(i, element){
            var result = {};
            result.title = $(element).children("h2.story-heading").children("a").text();
            result.link = $(element).children("h2.story-heading").children("a").attr("href");            
            result.summary= $(element).children("p.summary").text();

            ////store each scraped article in mongodb Article
            console.log(result);
           results.push(result);
        });

        db.Article
            .create(results)
            .then(function(dbArticles){
                res.json(dbArticles);
            })
            .catch(function(err){
                res.send(err);
            })
    })
});

 
app.listen(PORT);