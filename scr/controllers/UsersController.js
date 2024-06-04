const User = require('../models/User')
const Budget = require('../models/Budget')
const Trade = require('../models/Trade')
const Wallet = require('../models/Wallet');
const Group = require('../models/Group');

class UsersController{
    
    index(req,res){
        res.json("Đây là trang người dùng");
    }
    
    getusers(req, res) {
        User.find({}).then((user) =>{
            res.send(user);
        }).catch((error) => {
            console.log(error);
        });
    }

    async changepassword(req, res) {
        const data = req.body;
        try {
            const user = await User.findById(req.fromId);
            if (user.password == data.passwordOld) {
                console.log("Đổi mật khẩu tài khoản:", user.name);
                user.password = data.passwordNew
                await user.save()
                res.json({
                    status: true,
                    mes:"Đổi mật khẩu thàng công",
                })
            }else{
                res.json({
                    status: false,
                    mes:"Sai thông tin",
                })
            }
        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi đổi mật khẩu:", error._message);
        }
    }

    async deleacc(req, res) {
        try {
            let user = await User.findByIdAndDelete(req.fromId)
            await Trade.deleteMany({ fromId: req.fromId })
            await Budget.deleteMany({ fromId: req.fromId })
            await Wallet.deleteMany({ fromId: req.fromId })
            await Group.deleteMany({ fromId: req.fromId })
            if (user) {
                console.log("Xóa tài khoản:", user.name);
                res.json({
                    status: true,
                    mes:"Xóa tài khoản thành công"
                })
            }
            else{
                res.json({
                    status: false,
                    mes:"Không thể tìm thấy tài khoản muốn xóa"
                })
            }
        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi xóa tài khoản:", error._message);
        }
    }
}

module.exports = new UsersController;