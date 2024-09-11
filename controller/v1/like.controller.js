const Post = require('../../entity/post.entity');
const { Http } = require('../../util/http.util');
const { isValidMongoDbId } = require('../../util/utility.util');
const Like = require('./../../entity/like.entity');
const mongoose = require('mongoose');

const isPostLikedByUser = async (userId, postId) => {
    const post = await Post.findById(postId).populate('likes', '_id');
    if (!post) {
        return false;
    }

    return post
        .likes
        .some(like => like._id.toString() === userId.toString());
};

const likePostController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const postId = req.params.postId;
        const loggedInUser = req.user._id;

        if (!isValidMongoDbId(postId)) {
            await session.abortTransaction();
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'Invalid post id');
        }

        if (await isPostLikedByUser(loggedInUser, postId)) {
            await session.abortTransaction();
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'You have already liked this post');
        }

        const like = new Like({
            likedBy: loggedInUser,
            post: postId
        });

        await like.save({ session });

        const post = await Post.findById(postId);
        post.likes.push(loggedInUser);
        await post.save({ session });

        await session.commitTransaction();
        return Http.sendResponse(res, Http.SUCCESS, Http.SUCCESS_TRUE, 'Post liked');
    } catch (error) {
        await session.abortTransaction();
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, error.message);
    } finally {
        session.endSession();
    }
};

const unlikePostController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const postId = req.params.postId;
        const loggedInUser = req.user._id;

        if (!isValidMongoDbId(postId)) {
            await session.abortTransaction();
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'Invalid post id');
        }

        if (!(await isPostLikedByUser(loggedInUser, postId))) {
            await session.abortTransaction();
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'You have not liked this post yet');
        }

        await Like.deleteOne({ likedBy: loggedInUser, post: postId });

        const post = await Post.findById(postId);
        post.likes = post.likes.filter(like => like.toString() !== loggedInUser.toString());
        await post.save({ session });

        await session.commitTransaction();
        return Http.sendResponse(res, Http.SUCCESS, Http.SUCCESS_TRUE, 'Post unliked');
    } catch (error) {
        await session.abortTransaction();
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, error.message);
    } finally {
        session.endSession();
    }
};

module.exports = {
    likePostController,
    unlikePostController
};
