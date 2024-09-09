const User = require('../../entity/user.entity');
const JWT = require('jsonwebtoken');
const { Http } = require('../../util/http.util');


const signUpController = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const user = await User.findOne({
            $or: [
                { username: userName },
                { email: email }
            ]
        });

        if (user != null) {
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_TRUE, 'User already registered');
        }

        const userToBeSaved = new User({
            userName,
            email,
            password
        });
        await userToBeSaved.save();

        return Http
            .sendResponse(res, Http.CREATED, Http.SUCCESS_TRUE, 'User registered successfully', {
                userId: userToBeSaved._id
            });

    } catch (error) {
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, 'Internal server error');
    }
};

const signInController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user == null) {
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'User not registered');
        }
        const passwordsMatched = await user.matchPassword(password);
        if (!passwordsMatched) {
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'Invalid credentials');
        }

        const JWT_SECRET = process.env.JWT_SECRET_KEY;
        const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
        const accessToken = JWT.sign({ userId: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });

        const data = {
            token: accessToken,
            user: {
                id: user._id,
                username: user.userName,
                email: user.email
            }
        };

        return Http.sendResponse(res, Http.SUCCESS, Http.SUCCESS_TRUE, '', data);
    } catch (error) {
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, 'Internal server error');
    }
}

module.exports = {
    signUpController,
    signInController
};
