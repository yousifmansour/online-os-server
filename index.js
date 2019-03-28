var express = require('express');
var routes = require('./routes');
var https = require('https');
// var http = require('http');
var fs = require('fs');

var seedDB = require('./seedDB');
seedDB();
var app = express();

var cors = require('cors');
app.use(cors());

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

app.use('/', routes);

// var server = http.createServer(app);
var server = https.createServer(options, app);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('os_apps/Files'));

var setupSocketIo = require('./socketIoConfig');
setupSocketIo(server);

server.listen(5000, () => {
    console.log('listening on 5000');
});
