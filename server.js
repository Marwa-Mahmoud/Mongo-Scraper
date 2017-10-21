var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var request = require('request');
// var logger = require('morgan');
var mongoose = require('mongoose');

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

////Routes////////////
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/saved', function (req, res) {
    res.render('saved');
});

app.get('/scrape', function (req, res) {
    
    res.render('index', {msg: "hello"});
});

 
app.listen(PORT);