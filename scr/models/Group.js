const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    //0: Chi, 1: Thu
    type: {
        type: Number,
        require: true,
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'groups'
    },
    fromId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    walletId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'wallets',
        required: true
    }
}, {versionKey: false})

const Group = mongoose.model('groups', GroupSchema)

module.exports = Group