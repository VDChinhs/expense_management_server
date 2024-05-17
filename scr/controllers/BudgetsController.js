const User = require('../models/User')
const Budget = require('../models/Budget')
const Trade = require('../models/Trade');
const Group = require('../models/Group');
const HelpDate = require('../helpers/Date')
const Wallet = require('../models/Wallet');

class BudgetsController {

    index(req,res){
        res.json("Đây là trang ngân sách");
    }
    getbudgets(req, res) {
        try{
            Budget.find({}).then((user) =>{
                res.send(user);
            })
        }catch(error){
            console.error("Lỗi khi lấy tất cả ngân sách của người dùng:", error);
        }
    }

    async addbudget(req, res) {
        const data = req.body
        try{
            let budget = new Budget(data);
            budget.fromId = req.fromId
            await budget.save();
            res.json({
                status: true,
                mes:"Thêm ngân sách thành công",
            })
        }catch(error){
            console.error("Lỗi khi thêm ngân sách:", error);
        }
    }

    async delebudget(req, res) {
        const data = req.body
        try{
            let budget = await Budget.findByIdAndDelete(data.id)
            if (budget) {
                console.log("Xóa ngân sách:", budget._id);
                res.json({
                    status: true,
                    mes:"Xóa ngân sách thành công"
                })
            }
        }catch(error){
            console.error("Lỗi khi thêm ngân sách:", error);
        }
    }

    async changebudget(req, res) {
        const data = req.body
        try{
            let budget = await Budget.findByIdAndUpdate(
                data.id,
                {$set: {
                    money: data.money,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    groupId: data.groupId,
                    walletId: data.walletId,
                }}
            )
            if (budget) {
                console.log("Sửa ngân sách:", budget._id);
                res.json({
                    status: true,
                    mes:"Sửa ngân sách thành công"
                })
            }
        }catch(error){
            console.error("Lỗi khi sửa ngân sách:", error);
        }
    }

    async mybudget(req, res) {
        let current = new Date((new Date()).toISOString().split('T')[0] + 'T00:00:00.000Z')
        try{
            let allbudget = await Budget.find({
                fromId: req.fromId,
                endDate:{$gte: current}
            })
            if(allbudget.length == 0){
                res.json({
                    status: true,
                    mes:"Không có ngân sách",
                    data: []
                })
                return
            }
            let data = await Promise.all(allbudget.map(async (budget) => {
                let obj = {}
                let trade = await Trade.find({
                    fromId: budget.fromId,
                    walletId: budget.walletId,
                    groupId: budget.groupId,
                    date:{
                        $gte: budget.startDate,
                        $lte: budget.endDate
                    },
                    money: {$lt: 0} 
                }).populate('groupId')
                if (trade){
                    let moneyloss = trade.reduce((acc, trade) => acc + trade.money, 0)
                    obj._id = budget._id
                    obj.start = budget.startDate
                    obj.end = budget.endDate
                    obj.money = budget.money
                    obj.moneyloss = -moneyloss
                    obj.groupId = await Group.findById(budget.groupId)
                    obj.walletId = await Wallet.findById(budget.walletId)
                    return obj
                }
            }))
            let result = []
            while (data.length > 0) {
                const current = data[0];
                
                let obj = {}
                const trade = [];
                
                for (let i = data.length - 1; i >= 0; i--) {
                    if (HelpDate.isSameDate(data[i].start, current.start) && HelpDate.isSameDate(data[i].end, current.end)) {
                        trade.push(data[i]);
                        data.splice(i, 1);
                    }
                }
    
                obj.title = HelpDate.getTitle(trade[0].start, trade[0].end)
                obj.dateend = trade[0].end
                obj.data = trade
                result.push(obj);
            }   
            // console.log(result[0]);
            res.json({
                status: true,
                mes:"Lấy ngân sách",
                data: result
            })


        }catch(error){
            console.error("Lỗi khi lấy ngân sách:", error);
        }
    }

    async test(req, res) {
        try{
            let budget = await Budget.find().populate('fromId').populate('walletId')
            res.json(budget)
            console.log(budget);
        }catch(error){
            console.error("Lỗi khi test ngân sách:", error);
        }
    }
}

module.exports = new BudgetsController;