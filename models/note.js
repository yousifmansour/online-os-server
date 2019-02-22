const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: [mongoose.Schema.Types.Mixed],
        required: true
    },
    nextID: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;