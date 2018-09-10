let scrape = require("../scripts/scrape");

let headlineControl = require("../controllers/headlines");
let noteControl = require("../controllers/notes");

module.exports = function(router) {
    router.get("/", function(req,res) {
        res.render("index");
    });

    router.get("/saved", function(req,res) {
        res.render("saved");
    })

    router.get("/api/fetch", function(req, res) {
        headlineControl.fetch(function(err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today.  Check back tomorrow!"
                });
            }
            else {
                res.json ({
                    message: "added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });
    router.get("/api/headlines", function(req, res) {
        let query = [];
        if (req.quer.saved) {
            query = req.query;
        }
        headlineControl.get(query, function(data) {
            res.json(data);
        });
    });
    router.delete("/api/headlines/:id", function(req, res) {
        let query = {};
        query._id = req.params.id;
        headlineControl.delete(query, function(err, data) {
            res.json(data);
        });
    });
    router.patch("/api/headlines", function(req, res) {
        headlineControl.update(req.body, function(err, data) {
            res.json(data);
        });
    });
    router.get("/api/routes/:headline_id?", function(req, res) {
        let query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }
        noteControl.get(query, function(err, data) {
            res.json(data);
        });
    });
    router.delete("/api/note/:id", function(req, res) {
        let query = {};
        query._id = req.params.id;
        noteControl.delete(query, function(err, data) {
            res.json(data);
        });
    });
    router.post("/api/routes", function(req, res) {
        noteControl.save(req.body, function(data) {
            res.json(data);
        });
    });
}