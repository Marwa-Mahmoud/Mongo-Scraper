const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SavedArticleSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    link: String,
    summary: String,
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
      }]
});

var SavedArticle = mongoose.model("SavedArticle", SavedArticleSchema);

module.exports = SavedArticle;