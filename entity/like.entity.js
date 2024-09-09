const mongoose = require('mongoose');

const postModel = new mongoose.Schema({
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }
}, { timestamp: true })

module.exports = mongoose.model('Post', postModel);