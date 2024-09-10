const express = require('express');
const router = express.Router();

const {
    signUpController,
    signInController
} = require('../../controller/v1/auth.controller');

router.post('/register', signUpController);
router.post('/login', signInController);

module.exports = router;