var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = require('./models');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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

app.get('/state', (req, res) => {
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
                        res.send(state.state);
                    }
                });
            }
        );
});

http.listen(5000, () => {
    console.log('listening on 5000');
});