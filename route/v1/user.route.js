const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middleware/isLoggedIn.middleware');
const { getUserByIdController, updateUserProfileController } = require('../../controller/v1/user.controller');

router.get('/profile:userId', isLoggedIn, getUserByIdController);
router.put('/profile', isLoggedIn, updateUserProfileController);

module.exports = router;