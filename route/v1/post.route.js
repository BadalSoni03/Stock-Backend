const router = require('express').Router();
const isLoggedIn = require('./../../middleware/isLoggedIn.middleware');
const {
    createPostController,
    getPostById,
    deletePostById
} = require('../../controller/v1/post.controller');
const {
    createCommentController
} = require('./../../controller/v1/comment.controller')

router.post('/', isLoggedIn, createPostController);
router.get('/:postId', isLoggedIn, getPostById);
router.delete('/:postId', isLoggedIn, deletePostById);

router.post('/:postId/comments/', isLoggedIn, createCommentController);

module.exports = router;