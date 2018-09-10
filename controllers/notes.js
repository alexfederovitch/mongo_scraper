let note = require("../models/note");
let makeDate = require("../scripts/date");

module.exports = {
    get: function(data, call) {
        note.find({
            _healineId: data._id
        }, call);
    },
    save: function(data, call) {
        let newNote = {
            _headlineId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
        note.create(newNote, function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
                call(doc);
            }
        });
    },
    delete: function(data, call) {
        note.remove({
            _id: data._id
        }, call);
    }
}