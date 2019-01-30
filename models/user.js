const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: false
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;