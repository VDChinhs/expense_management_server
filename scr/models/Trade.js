const mongoose = require('mongoose')

const TradeSchema = new mongoose.Schema({
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    money: {
        type: Number,
        require: true,
    },
    note:{
        type: String,
        default: ""
    },
    date: {
        type: Date,
        require: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'groups',
        required: true
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'wallets',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {versionKey: false})

const Trade = mongoose.model('trades', TradeSchema)

module.exports = Trade