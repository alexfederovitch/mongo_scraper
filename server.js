let express = require("express");
let bodyParser = require("body-parser");
let exphbs  = require('express-handlebars');
// let logger = require("morgan");
let mongoose = require("mongoose");
let path = require("path");

let axios = require("axios");
let cheerio = require("cheerio");

// Require all models
let Article = require("./models/headline");
let Note = require("./models/note");

let PORT = process.env.PORT || 3000;

// Initialize Express
let app = express();

let router = express.Router();

require("./config/routes")(router);

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + "/public"));


app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
    extended: false
}));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("connection good!")
    }
});

app.use(router);

app.listen(PORT, function() {
    console.log("App running on http://localhost:" + PORT);
  });

  // Routes

  app.get("/", function(req, res) {
    Article.find({"saved": false}, function(error, data) {
      var hbsObject = {
        article: data
      };
      console.log(hbsObject);
      res.render("home", hbsObject);
    });
  });

  app.get("/saved", function(req, res) {
    Article.find({"saved": true}).populate("notes").exec(function(error, articles) {
      var hbsObject = {
        article: articles
      };
      res.render("saved", hbsObject);
    });
  });

// A GET route for scraping the website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.nytimes.com").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Save an article
app.post("/articles/save/:id", function(req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

// Delete an article
app.post("/articles/delete/:id", function(req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.id }, {"saved": false, "notes": []})
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});
