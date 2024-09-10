const Post = require('./../../entity/post.entity');
const { Http } = require('../../util/http.util');
const mongoose = require('mongoose');
const { isValidMongoDbId } = require('../../util/utility.util');

const createPostController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { stockSymbol, title, description, tags } = req.body;
        const loggedInUser = req.user;

        const post = new Post({
            postedBy: loggedInUser,
            symbol: stockSymbol,
            title,
            description,
            tags
        });


        await post.save({ session });

        loggedInUser.posts.push(post);
        await loggedInUser.save({ session });

        session.commitTransaction();
        return Http
            .sendResponse(res, Http.CREATED, Http.SUCCESS_TRUE, 'Post created successfully', {
                postId: post._id
            });

    } catch (error) {
        session.abortTransaction();
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, error.message);
    }
};

const getPostById = async (req, res) => {
    try {
        let postId = req.params.postId;
        if (!isValidMongoDbId(postId)) {
            return Http.sendResponse(res, Http.NOT_FOUND, Http.SUCCESS_FALSE, 'Invalid Post ID');
        }
        const post = await Post
            .findById(postId)
            .populate('comments')
            .exec();

        if (!post) {
            return Http.sendResponse(res, Http.NOT_FOUND, Http.SUCCESS_FALSE, 'postId not found');
        }

        const commentsOnPost = [];
        for (const comment of post.comments) {
            commentsOnPost.push({
                commentId: comment._id,
                userId: comment.commentedBy._id,
                comment: comment.text,
                createdAt: comment.createdAt
            });
        }

        const data = {
            postId: post._id,
            stockSymbol: post.symbol,
            title: post.title,
            description: post.description,
            likesCount: post.likes.length,
            comments: commentsOnPost
        }

        return Http.sendResponse(res, Http.SUCCESS, Http.SUCCESS_TRUE, 'Ok', data);
    } catch (error) {
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, error.message);
    }
}

const deletePostById = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const postIdToRemove = req.params.postId;
        if (!isValidMongoDbId(postIdToRemove)) {
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'Invalid Post ID');
        }

        const loggedInUser = req.user;
        const index = loggedInUser
            .posts
            .findIndex(postId => postId.toString() === postIdToRemove.toString());

        if (index !== -1) {
            loggedInUser.posts.splice(index, 1);
        }

        await loggedInUser.save({ session });
        await Post.deleteOne({ _id: postIdToRemove });

        session.commitTransaction();
        return Http.sendResponse(res, Http.SUCCESS, Http.SUCCESS_TRUE, 'Post deleted successfully');
    } catch (error) {
        session.abortTransaction();
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, error.message);
    }
}

const getFilteredPost = async (req, res) => {
    // todo: filter posts based on time, symbol, etc..
}

module.exports = {
    createPostController,
    getPostById,
    deletePostById
}