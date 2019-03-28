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
                        if (note) 
                            res.send({notes: note.notes, nextID: note.nextID});
                        else 
                            res.send({notes: [], nextID: 1})
                    }
                });
            }
        );
});

module.exports = router;