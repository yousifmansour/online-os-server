var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/state', (req, res) => {
    db
        .User
        .findOne({
            name: 'sudo'
        }, (error, user) => {
            if (!error) 
                db.State.findOne({
                    user: user._id
                }, (error, state) => {
                    if (!error) {
                        if (!state.state) 
                            res.send({});
                        else 
                            res.send(state.state);
                        }
                    });
            }
        );
});

module.exports = router;