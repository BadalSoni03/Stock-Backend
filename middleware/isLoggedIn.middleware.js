const JWT = require('jsonwebtoken');
const { Http } = require("../util/http.util");
const User = require('../entity/user.entity');

const isLoggedIn = async (req, res, next) => {
    try {
        const authToken = req.headers?.authorization;
        const splittedToken = authToken.split(' ');

        const authTokenComponents = 2;
        const BEARER = 'Bearer';

        if (splittedToken.length != authTokenComponents || (splittedToken[0] != BEARER)) {
            throw new Error('Invalid Token format');
        }

        const claims = JWT.verify(splittedToken[1], process.env.JWT_SECRET_KEY);
        const user = await User.findById(claims.userId);

        if (!user) {
            throw new Error('Invalid Token');
        }
        req.user = user;
        next();
    } catch (error) {
        return Http
            .sendResponse(res, Http.UNAUTHORIZED, Http.SUCCESS_FALSE, error.message);
    }
}

module.exports = isLoggedIn;