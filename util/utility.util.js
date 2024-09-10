const mongoose = require('mongoose');

const isValidMongoDbId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
    isValidMongoDbId
}