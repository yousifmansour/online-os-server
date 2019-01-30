const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    state: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const State = mongoose.model('State', stateSchema);
module.exports = State;