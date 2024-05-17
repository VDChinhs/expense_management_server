const mongoose = require('mongoose')
const GroupSchema = require('../models/Group')

const WalletSchema = new mongoose.Schema({
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:true
    },
    name: {
        type: String,
        require: true,
    },
    money: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true,
    },
    
},{versionKey: false})


const Wallet = mongoose.model('wallets', WalletSchema)

module.exports = Wallet