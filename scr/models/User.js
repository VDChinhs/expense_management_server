const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
    },
}, {versionKey: false});

const User = mongoose.model('users', UserSchema)

module.exports = User
