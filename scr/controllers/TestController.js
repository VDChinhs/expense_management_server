class TestController{
    
    index(req,res){
        res.json("Đây là trang Test")
    }
    login(req,res){
        var data = req.body;
        console.log(data);
        res.json({
            name:"Đăng nhập",
            data:data
        })
    }
    sign(req,res){
        var data = req.body;
        console.log(data);
        res.json({
            status:"Đăng ký thành công",
            data:data
        })
    }
}

module.exports = new TestController;