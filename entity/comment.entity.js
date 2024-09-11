const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema);