var db = require('./models');

let setupSocketIo = (server) => {
    var io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log("Socket connected: " + socket.id);
        // broadcast received actions to other connected clients
        socket.on('action', (action) => {
            console.log({
                ...action,
                fromServer: true
            });
            socket
                .broadcast
                .emit('action', {
                    ...action,
                    fromServer: true
                });
        });
        socket.on('update state', (newState) => {
            if (newState.notes.notes !== null) {
                // there was a note udpate, save notes in db
                db
                    .User
                    .findOne({
                        name: 'sudo'
                    }, (error, user) => {
                        if (!error) {
                            db
                                .Note
                                .findOneAndUpdate({
                                    user: user._id
                                }, {
                                    notes: newState.notes.notes,
                                    nextID: newState.notes.nextID
                                }, (error, state) => {
                                    if (!error) {
                                        console.log('updated notes');
                                    };
                                });
                        }
                    });
            }
            // set state of global to new state
            db
                .User
                .findOne({
                    name: 'sudo'
                }, (error, user) => {
                    if (!error) {
                        db
                            .State
                            .findOneAndUpdate({
                                user: user._id
                            }, {
                                state: newState
                            }, (error, state) => {
                                if (!error) {
                                    console.log('updated state');
                                };
                            });
                    }
                });
        });
    });
}

module.exports = setupSocketIo;