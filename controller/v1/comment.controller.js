const Post = require('../../entity/post.entity');
const { Http } = require('../../util/http.util');
const { isValidMongoDbId } = require('../../util/utility.util');
const Comment = require('./../../entity/comment.entity');
const mongoose = require('mongoose');

const createCommentController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { comment } = req.body;
        const postId = req.params.postId;

        if (!isValidMongoDbId(postId)) {
            session.abortTransaction();
            return Http.sendResponse(res, Http.NOT_FOUND, Http.SUCCESS_FALSE, 'postId not found');
        }

        const post = await Post.findById(postId);

        const newComment = new Comment({
            commentedBy: req.user,
            post: post,
            text: comment
        });
        await newComment.save({ session });

        post.comments.push(newComment);
        await post.save({ session });

        session.commitTransaction();
        return Http
            .sendResponse(res, Http.CREATED, Http.SUCCESS_TRUE, 'Comment added successfully', {
                commentId: newComment._id
            });
    } catch (error) {
        session.abortTransaction();
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, error.message);
    }
};

const deleteCommentById = async (req, res) => {
    const session = await mongoose.startSession();
    mongoose.startTransaction();
    try {
        // todo:

    } catch (error) {
        mongoose.abortTransaction();
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_TRUE, error.message);
    }
};

module.exports = {
    createCommentController,
    deleteCommentById
}