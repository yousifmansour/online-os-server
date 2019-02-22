var fs = require('fs');

// var http = require('http');

var https = require('https');

var express = require('express');
var app = express();

var privateKey = fs
    .readFileSync('/etc/letsencrypt/live/www.yousifmansour.space/privkey.pem')
    .toString();
var certificate = fs
    .readFileSync('/etc/letsencrypt/live/www.yousifmansour.space/fullchain.pem')
    .toString();
var options = {
    key: privateKey,
    cert: certificate
};

// var server = http.createServer(app);
var server = https.createServer(options, app);

var io = require('socket.io')(server);

var cors = require('cors');
app.use(cors());

var db = require('./models');

// CREATE NOTE FOR USER

/*
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
*/

// CREATE NOTE FOR USER

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

app.get('/notes', (req, res) => {
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

app.get('/diaries/:week', (req, res) => {
    let week = req.params.week;
    let diary = fs
        .readFileSync('./os_apps/Diary/' + week + '.html')
        .toString();
    res.send(diary);
});

app.get('/diaries', (req, res) => {
    let diaries = fs.readdirSync('./os_apps/Diary/');
    res.send(diaries);
});

server.listen(5000, () => {
    console.log('listening on 5000');
});
