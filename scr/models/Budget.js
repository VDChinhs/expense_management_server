const mongoose = require('mongoose')
const { Schema, model } = mongoose

const BudgetSchema = new Schema({
    fromId: {
        type: Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    money: {
        type: Number,
        require: true,
        min: 1
    },
    startDate: {
        type: Date,
        require: true,
    },
    endDate: {
        type: Date,
        require: true,
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref :'wallets',
        required: true
    }
    
},{versionKey: false})

const Budget = model('budgets', BudgetSchema)

module.exports = Budget