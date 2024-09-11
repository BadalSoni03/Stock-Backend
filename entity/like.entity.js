const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Like', likeSchema);