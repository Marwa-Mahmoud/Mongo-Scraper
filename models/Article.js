const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    link: String,
    summary: String
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;