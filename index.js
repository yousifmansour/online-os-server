var fs = require('fs');

var https = require('https');

var express = require('express');
var app = express();

var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.yousifmansour.space/privkey.pem').toString();
var certificate = fs.readFileSync('/etc/letsencrypt/live/www.yousifmansour.space/fullchain.pem').toString();
var options = {key: privateKey, cert: certificate};

var server = https.createServer(options, app);
var io = require('socket.io')(server);

var cors = require('cors');
app.use(cors());

var db = require('./models');

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

server.listen(5000, () => {
    console.log('listening on 5000');
});
