const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	postedBy: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	symbol: {
		type: String,
		required: true
	},
	likes: [{
		type: mongoose.Types.ObjectId,
		ref: 'User'
	}],
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	comments: [{
		type: mongoose.Types.ObjectId,
		ref: 'Comment'
	}],
	tags: [{
		type: mongoose.Types.ObjectId,
		ref: 'User'
	}]
}, { timestamp: true })

module.exports = mongoose.model('Post', postSchema);