let request = require("request");
let cheerio = require("cheerio");

const scrape = function (call) {
    request("http://www.nytimes.com", function(err, res, body) {
        let $ = cheerio.load(body);

        let articles = [];

        $(".theme-summary").each(function(i, element) {
            let head = $(this).children(".story-heading").text().trim();
            let sum = $(this).children(".summary").text().trim();

            let addedData = {
                headLine: head,
                summary: sum
            }

            articles.push(addedData);
        });
        call(articles);
    });
};