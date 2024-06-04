const Group = require('../models/Group')
const Trade = require('../models/Trade')
const Budget = require('../models/Budget')

class GroupController{
    
    index(req,res){
        res.json("Đây là trang nhóm");
    }
    getgroups(req, res) {
        try{
            Group.find({}).then((user) =>{
                res.send(user);
            })
        }catch(error){
            console.error("Lỗi khi lấy tất cả nhóm của người dùng:", error);
        }
    }

    async addgroup(req, res) {
        const data = req.body
        try{
            let existingGroup = await Group.find({ fromId: req.fromId, walletId: data.walletId})
            if (!existingGroup.some(group => group.name == data.name)){
                let group = new Group(data);
                group.fromId = req.fromId
                if(data.parent == undefined){
                    group.parent = group._id
                }
                await group.save();
                res.json({
                    status: true,
                    mes:"Thêm nhóm thành công",
                })
            }
            else{
                res.json({
                    status: false,
                    mes:"Nhóm đã tồn tại",
                }) 
            }
        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi thêm nhóm:", error._message);
        }
    }

    async delegroup(req, res) {
        const data = req.body
        try{
            let group = await Group.findByIdAndDelete(data.id)
            await Trade.deleteMany({ groupId: data.id })
            await Budget.deleteMany({ groupId: data.id })
            if (group) {
                console.log("Xóa nhóm:", group._id);
                res.json({
                    status: true,
                    mes:"Xóa nhóm thành công"
                })
            }
        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi thêm nhóm:", error._message);
        }
    }

    async changegroup(req, res) {
        const data = req.body
        try{
            let existingGroup = await Group.findOne({ fromId: req.fromId, walletId: data.walletId, name: data.name, _id: {$ne: data.id} })
            if (!existingGroup) {
                if (data.parent == undefined) {
                    data.parent = data.id
                }
                let group = await Group.findByIdAndUpdate(
                    data.id,
                    {$set: {
                        name: data.name,
                        image: data.image,
                        parent: data.parent,
                    }}
                )
    
                if (group) {
                    console.log("Sửa nhóm:", group._id);
                    let groupnode = await Group.updateMany(
                        {parent: group._id},
                        { $set: { 
                            parent: data.parent 
                        }}
                    )
                    res.json({
                        status: true,
                        mes:"Sửa nhóm thành công"
                    })
                }
  
            }
            else{
                res.json({
                    status: false,
                    mes:"Tên nhóm đã tồn tại",
                }) 
            }
        }catch(error){
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi khi sửa nhóm:", error._message);
        }
    }

    async mygroup(req, res) {
        const data = req.query
        try {
            let values = []
            let myGroup = await Group.find({ fromId: req.fromId, walletId: data.walletId, type: data.type}).populate('parent')
            let groupParent = myGroup.filter((group => group._id.equals(group.parent._id)))
            let groupNode = myGroup.filter((group => !group._id.equals(group.parent._id)))

            groupParent.forEach(root => {
                let obj = {}
                obj.root = root
                obj.node = groupNode.filter((group => group.parent._id.equals(root._id)))
                values.push(obj)
            });
            res.json(values)
            
        } catch (error) {
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi lấy nhóm của tôi:", error._message);
        }
    }

    async groupparent(req, res) {
        const data = req.query
        try {
            let myGroup = await Group.find({ fromId: req.fromId, type: data.type, walletId: data.walletId})
            let groupParent = myGroup.filter((group => group._id.equals(group.parent)))
            res.json(groupParent)
        } catch (error) {
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi lấy nhóm cha của tôi:", error._message);
        }
    }

    async getallthuchi(req, res) {
        const data = req.query
        try {
            let myGroup = await Group.find({ fromId: req.fromId, walletId: data.walletId}).populate('parent')
            const sortedGroup = myGroup.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });              
            res.json(sortedGroup)
        } catch (error) {
            res.json({
                status: false,
                mes: error._message,
            })
            console.error("Lỗi lấy tất cả group thu chi:", error._message);
        }
    }

    async test(req, res) {
        try{
            let group = await Group.find().populate('fromId').populate('walletId')
            res.json(group)
            console.log(group);
        }catch(error){
            console.error("Lỗi khi test nhóm:", error);
        }
    }
}

module.exports = new GroupController;