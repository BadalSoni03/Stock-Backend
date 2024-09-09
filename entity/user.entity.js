const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        require: true
    },
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        if (!enteredPassword) {
            throw new Error('Password is missing');
        }
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.log('Error occurred while matching passwords : ' + error.message);
    }
};

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

module.exports = mongoose.model('User', userSchema);