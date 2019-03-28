var express = require('express');
var db = require('../../models');
var router = express.Router();

router.get('/', (req, res) => {
    db
        .User
        .findOne({
            name: 'sudo'
        }, (error, user) => {
            if (!error) 
                db.Note.findOne({
                    user: user._id
                }, (error, note) => {
                    if (!error) {
                        res.send({notes: note.notes, nextID: note.nextID});
                    }
                });
            }
        );
});

module.exports = router;