let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let headlines = new Schema ({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

let Article = mongoose.model("Article", headlines);

module.exports = Article;