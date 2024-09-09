const mongoose = require('mongoose');

const postModel = new mongoose.Schema({
    commentedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true
    },
	text: {
        type: String
    },
    tags: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamp: true })

module.exports = mongoose.model('Comment', postModel);