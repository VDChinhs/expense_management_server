const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/money_app');
        console.log("Đã kết nối Database");
    } catch (error) {
        console.log("Không thể kết nối với Database");
    }
}

module.exports = {connect};