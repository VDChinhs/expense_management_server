var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const env = require('dotenv').config()
const User = require('../models/User')
const Wallet = require('../models/Wallet')
const {GroupChiDefault, GroupThuDefault} = require('../helpers/CreateDefault')

class AccountController {

    index(req,res){
        res.json("Đây là trang đăng nhập");
    }

    async sign(req, res) {
        const data = req.body;
        try {
            const saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(data.password, salt);

            const existingUser = await User.exists({ username: data.username });
            if (existingUser) {
                res.json({
                    status: false,
                    mes:"Tên đăng nhập đã tồn tại trong cơ sở dữ liệu.",
                })
            } else {
                const per = new User(data);
                per.password = hash
                await per.save();
                console.log("Tài khoản vừa được tạo:", data.username);

                const wallet = new Wallet({
                    fromId: per._id,
                    name: "Cast",
                    money: 0,
                    image: 'https://firebasestorage.googleapis.com/v0/b/moneysaver-acdd1.appspot.com/o/icons%2F51.png?alt=media&token=1682f2d1-dbe2-4217-9d71-b6d168e3f659' 
                });

                await wallet.save();

                await GroupChiDefault(per._id, wallet._id)
                await GroupThuDefault(per._id, wallet._id)

                res.json({
                    status: true,
                    mes:"Tạo tài khoản thành công",
                })
            }
        } catch (error) {
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi đăng ký tài khoản:", error._message);
        }
    }

    async login(req, res) {
        const data = req.body;
        try {
            const existingUser = await User.findOne({ 
                username: data.username,
                // password: data.password
            });
            if (existingUser) {
                if (bcrypt.compareSync(data.password, existingUser.password)) {
                    console.log("Tài khoản vừa đăng nhập:", existingUser.name)
                    let token = jwt.sign({
                        fromId: existingUser.id,
                        username: existingUser.username,
                    }, process.env.VERIFY_TOKEN, {expiresIn:'1d'})
                    res.json({
                        status: true,
                        mes:"Đăng nhập thành công",
                        token: token,
                        data: existingUser
                    })
                }
                else {
                    res.json({
                        status: false,
                        mes:"Sai thông tin đăng nhập",
                    })
                }
            } else {
                res.json({
                    status: false,
                    mes:"Sai thông tin đăng nhập",
                })
            }
        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi kiểm tra đăng nhập:", error._message);
        }
    }

}


module.exports = new AccountController;