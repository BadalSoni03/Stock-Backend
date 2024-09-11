const User = require("../../entity/user.entity");
const { Http } = require("../../util/http.util");
const { isValidMongoDbId } = require("../../util/utility.util");

const getUserByIdController = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!isValidMongoDbId(userId)) {
            return Http.sendResponse(res, Http.NOT_FOUND, Http.SUCCESS_FALSE, 'Invalid user id');
        }

        const user = await User.findById(userId);
        if (!user) {
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'User not found');
        }

        const data = {
            id: user._id,
            username: user.userName,
            bio: user.bio,
            profilePicture: user.profilePicture
        };

        return Http.sendResponse(res, Http.SUCCESS, Http.SUCCESS_TRUE, data);
    } catch (error) {
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, error.message);
    }
}

const updateUserProfileController = async (req, res) => {
    try {
        const { username, bio, profilePicture } = req.body;
        const loggedInUser = req.user;

        const user = await User.findOne({ userName: username });
        if (user) {
            return Http.sendResponse(res, Http.BAD_REQUEST, Http.SUCCESS_FALSE, 'username already taken');
        }

        user.userName = username;
        user.bio = bio;
        user.profilePicture = profilePicture;

        await user.save();
        return Http.sendResponse(res, Http.SUCCESS, Http.SUCCESS_TRUE, 'Profile updated');
    } catch (error) {
        return Http.sendResponse(res, Http.INTERNAL_SERVER_ERROR, Http.SUCCESS_FALSE, error.message);
    }
}


module.exports = {
    getUserByIdController,
    updateUserProfileController
}