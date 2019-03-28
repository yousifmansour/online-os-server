// CREATE NOTE FOR USER
var db = require('./models');

db
    .Note
    .remove({}, () => console.log('removed notes'));

db
    .User
    .findOne({
        name: 'sudo'
    }, (error, user) => {
        // create notes
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
    });
