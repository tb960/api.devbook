const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        verification: {
            type: String,
        },
        userAccountStatus: {
            type: String,
            enum: ['NOTVERIFIED', 'VERIFIED', 'DISABLED'],
            default: 'NOTVERIFIED',
        }
    }
);

var User = mongoose.model("User", UserSchema);

module.exports = User;