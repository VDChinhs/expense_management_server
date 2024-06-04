const User = require('../models/User')
const Wallet = require('../models/Wallet')
const Trade = require('../models/Trade')
const Budget = require('../models/Budget');
const Group = require('../models/Group');
const {GroupChiDefault, GroupThuDefault} = require('../helpers/CreateDefault')

class WalletsController {

    index(req,res){
        res.json("Đây là trang ví");
    }
    getwallets(req, res) {
        try{
            Wallet.find({}).then((user) =>{
                res.send(user);
            })
        }catch(error){
            console.error("Lỗi khi lấy tất cả ví của người dùng:", error);
        }
    }

    async addwallet(req, res) {
        const data = req.body
        try{
            let User = await Wallet.find({ fromId: req.fromId})
            if (!User.some(wallet => wallet.name == data.name)){
                let wallet = new Wallet({
                    fromId: req.fromId,
                    name: data.name,
                    money: data.money,
                    image: data.image
                });

                await wallet.save();

                await GroupChiDefault(req.fromId, wallet._id)
                await GroupThuDefault(req.fromId, wallet._id)

                res.json({
                    status: true,
                    mes:"Thêm ví thành công",
                })
            }
            else{
                res.json({
                    status: false,
                    mes:"Ví đã tồn tại",
                }) 
            }
        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi thêm ví:", error._message);
        }
    }

    async delewallet(req,res){
        const data = req.body
        try {
            let wallet = await Wallet.findByIdAndDelete(data.id)
            await Trade.deleteMany({ walletId: data.id })
            await Budget.deleteMany({ walletId: data.id })
            await Group.deleteMany({ walletId: data.id })
            if (wallet) {
                console.log("Xóa ví:", wallet._id);
                res.json({
                    status: true,
                    mes:"Xóa ví thành công"
                })
            }
            else{
                res.json({
                    status: false,
                    mes:"Ví không tồn tại"
                })
            }
        } catch (error) {
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi xóa ví:", error._message);
        }
    }

    async changewallet(req,res){
        const data = req.body
        try {
            let existingGroup = await Wallet.findOne({ fromId: req.fromId, name: data.name, _id: {$ne: data.id} })
            if(!existingGroup){
                let wallet = await Wallet.findByIdAndUpdate(
                    data.id,
                    {$set: {
                        name: data.name,
                        image: data.image,
                    }}
                )
                if (wallet) {
                    console.log("Sửa ví:", wallet._id);
                    res.json({
                        status: true,
                        mes:"Sửa ví thành công"
                    })
                }
            }
            else{
                res.json({
                    status: false,
                    mes:"Tên ví đã tồn tại",
                })
            }
        } catch (error) {
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi sửa ví:", error._message);
        }
    }

    async walletfirst(req, res){
        try{
            let mywallet = await Wallet.find({ fromId: req.fromId}).select('name money image')
            if (mywallet.length < 3) {
                res.json(mywallet)
            }
            else{
                res.json(mywallet.slice(0,3))
            }

        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi lấy ví của tôi:", error._message);
        }
    }

    async mywallet(req, res){
        try{
            let mywallet = await Wallet.find({ fromId: req.fromId}).select('name money image')
            if (mywallet) {
                res.json(mywallet)
            }
            else{
                console.log("Không tìm thấy ví");
            }

        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi lấy ví của tôi:", error._message);
        }
    }

}

module.exports = new WalletsController;