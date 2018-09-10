let scrape = require("../scripts/scrape");
let makeDate = require("../scripts/date");

let headline = require("../models/headline");

module.exports = {
    fetch: function(call) {
        scrape(function(data) {
            let articles = data;
            for (let i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            headline.collection.insertMany(articles, {ordered:false}, function(err, docs) {
                call(err, docs);
            });
        });
    },
    delete: function(query, call) {
        headline.remove(query, call);
    },
    get: function(query, call) {
        headline.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            call(doc);
        });
    },
    updates: function(query, call) {
        headline.update({_id: query._id,
            $set: query
        }, {}, call);
    }
}