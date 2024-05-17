const User = require('./models/User')
const Budget = require('./models/Budget')

const documentId = '660fefadcd670d5ba9685e1e';

const arrayId = '660fefadcd670d5ba9685e24'

const newTransaction = {
    date: "2024-12-2",
    group: 'Du lịch',
    money: 1000
};

async function udpate() {
    try {
        let budget = Budget.find().populate('walletId', 'name')
        console.log(budget);
    }
    catch(error){
        console.log(error);
    }
}

module.exports = udpate