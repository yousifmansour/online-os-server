var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/online-os', {useNewUrlParser: true});

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// Get the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.User = require('./user');
module.exports.State = require('./state');
module.exports.Note = require('./note');