const router = require('express').Router();
const isLoggedIn = require('./../../middleware/isLoggedIn.middleware');

const {
    createPostController,
    getPostById,
    deletePostById,
    getAllPosts
} = require('../../controller/v1/post.controller');

const {
    createCommentController,
    deleteCommentById
} = require('./../../controller/v1/comment.controller')

const {
    likePostController,
    unlikePostController
} = require('./../../controller/v1/like.controller');

router.post('/', isLoggedIn, createPostController);
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.delete('/:postId', isLoggedIn, deletePostById);

router.post('/:postId/comments/', isLoggedIn, createCommentController);
router.delete('/:postId/comments/:commentId', isLoggedIn, deleteCommentById);

router.post('/:postId/like', isLoggedIn, likePostController);
router.delete('/:postId/like', isLoggedIn, unlikePostController);

module.exports = router;