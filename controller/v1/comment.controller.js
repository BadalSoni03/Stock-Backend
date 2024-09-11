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
    } finally {
        session.endSession();
    }
};

const deleteCommentById = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { postId, commentId } = req.params;
        console.log('PostId: ' + postId);
        console.log('Comment Id: ' + commentId);
        if (!isValidMongoDbId(postId)) {
            session.abortTransaction();
            return Http
                .sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'Invalid post Id');
        }
        if (!isValidMongoDbId(commentId)) {
            session.abortTransaction();
            return Http
                .sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'Invalid comment Id');
        }

        const post = await Post.findById(postId);
        const index = post
            .comments
            .findIndex(cId => cId.toString() === commentId.toString());

        if (index !== -1) {
            post.comments.splice(index, 1);
        }

        await post.save({ session });
        await Comment.deleteOne({ _id: commentId });
        
        session.commitTransaction();
        return Http
            .sendResponse(res, Http.SUCCESS, Http.SUCCESS_TRUE, 'Comment deleted successfully');
    } catch (error) {
        mongoose.abortTransaction();
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_TRUE, error.message);
    } finally {
        session.endSession();
    }
};

module.exports = {
    createCommentController,
    deleteCommentById
}