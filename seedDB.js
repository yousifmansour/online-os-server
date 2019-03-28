// CREATE NOTE FOR USER
var db = require('./models');

let seedDB = () => {
    db
        .User
        .findOne({
            name: 'sudo'
        }, (error, user) => {
            if (!user) {
                db
                    .User
                    .create({
                        name: 'sudo'
                    }, (error, user) => {
                        db
                            .State
                            .create({
                                user: user._id,
                                state: {}
                            }, (error) => {
                                if (!error) {
                                    db
                                        .Note
                                        .remove({}, () => console.log('removed notes'));
                                    db
                                        .Note
                                        .create({
                                            user: user._id,
                                            notes: [
                                                {
                                                    id: 0,
                                                    text: 'from server'
                                                }
                                            ],
                                            nextID: 1
                                        }, () => console.log('created notes for user'));
                                }
                                console.log('seeding done');
                            });
                    });

            } else 
                console.log('no seeding needed')

        });
}

module.exports = seedDB;