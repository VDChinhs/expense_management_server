const User = require('../models/User')
const Trade = require('../models/Trade');
const Group = require('../models/Group');
const Wallet = require('../models/Wallet');
const HelpDate = require('../helpers/Date')
const HelpColor = require('../helpers/Colors')

class TradesController {

    index(req,res){
        res.json("Đây là trang giao dịch");
    }
    gettrades(req, res) {
        try{
            Trade.find({}).then((user) =>{
                res.send(user);
            })
        }catch(error){
            console.error("Lỗi khi lấy tất cả giao dịch của người dùng:", error);
        }
    }

    async addtrade(req, res) {
        const data = req.body
        try{
            let trade = new Trade(data);
            let group = await Group.findById(data.groupId)
            let wallet = await Wallet.findById({_id: data.walletId})
            if(group?.type == 0){
                trade.money = -(data.money)
            }
            if (group && wallet) {
                trade.fromId = req.fromId
                wallet.money = wallet.money + trade.money
                await trade.save();
                await wallet.save()
            }
            res.json({
                status: true,
                mes:"Thêm giao dịch thành công",
            })
        }catch(error){
            console.error("Lỗi khi thêm giao dịch:", error);
        }
    }

    async deletrade(req, res) {
        const data = req.body
        try{
            let trade = await Trade.findByIdAndDelete(data.id)
            let wallet = await Wallet.findById({_id: trade.walletId})
            let group = await Group.findById({_id: trade.groupId})
            if (trade && wallet && trade) {
                console.log("Xóa giao dịch:", trade._id);
                wallet.money = wallet.money - (group?.type == 0 ? (trade.money) : (trade.money))
                await wallet.save()
                res.json({
                    status: true,
                    mes:"Xóa giao dịch thành công"
                })
            }
        }catch(error){
            console.error("Lỗi khi xóa giao dịch:", error);
        }
    }

    async changetrade(req, res) {
        const data = req.body
        try{
            let group = await Group.findById(data.groupId)
            let wallet = await Wallet.findById({_id: data.walletId})
            let trade = await Trade.findByIdAndUpdate(
                data.id,
                {$set: {
                    money: group?.type == 0 ? -(data.money) : (data.money),
                    groupId: data.groupId,
                    note: data.note,
                    date: data.date,
                    walletId: data.walletId
                }}
            )
            if (trade && wallet && trade) {
                console.log("Sửa giao dịch:", trade._id);
                wallet.money = wallet.money - trade.money + (group?.type == 0 ? -(data.money) : (data.money))
                await wallet.save()
                res.json({
                    status: true,
                    mes:"Sửa giao dịch thành công"
                })
            }
        }catch(error){
            console.error("Lỗi khi sửa giao dịch:", error);
        }
    }

    async traderecent(req, res) {
        try{
            let traderecent = await Trade.find({ fromId: req.fromId }).populate('groupId').populate('walletId').sort({ createdAt: -1 }).limit(4)
            if (traderecent) {
                res.json({
                    status: true,
                    mes:"Lấy giao dịch gần đây thành công",
                    data: traderecent
                })
            }
        }catch(error){
            console.error("Lỗi khi lấy giao dịch:", error);
        }
    }

    async mosttrademonth(req, res){
        const data = req.query
        const month = data.month; 
        const year = new Date().getFullYear() 
        const firstDayOfMonth = new Date(year, month-1, 2);
        const lastDayOfMonth = new Date(year, month, 1);

        const firstDayOfLastMonth = new Date(year, month-2, 2);
        const lastDayOfLastMonth = new Date(year, month-1, 1);

        try {
            let alltrade = await Trade.find({ 
                fromId: req.fromId,
                date:{
                    $gte: firstDayOfMonth,
                    $lte: lastDayOfMonth
                },
                money: {$lt: 0} 
            })

            let alltradelastmonth = await Trade.find({ 
                fromId: req.fromId,
                date:{
                    $gte: firstDayOfLastMonth,
                    $lte: lastDayOfLastMonth
                },
                money: {$lt: 0} 
            })
            let sumLastMonth = alltradelastmonth.reduce((acc, trade) => acc + trade.money, 0)

            let traderecent = await Trade.find({ 
                fromId: req.fromId,
                date:{
                    $gte: firstDayOfMonth,
                    $lte: lastDayOfMonth
                },
                money: {$lt: 0}
            }).populate('groupId').populate('walletId').sort({ money: 1 }).limit(3)

            if (traderecent) {
                let dataMonth = {}
                let valuesChiTieu = []
                let sum = alltrade.reduce((acc, trade) => acc + trade.money, 0)

                traderecent.map(trade => {
                    let obj = {}
                    let percent = trade.money / sum

                    obj.money = -trade.money
                    obj.percent = (percent * 100).toFixed(0) + '%'
                    obj.group = trade.groupId
                    obj.wallet = trade.walletId
                    valuesChiTieu.push(obj)
                })

                dataMonth.sum = -sum
                dataMonth.labels = [ "Tháng trước", "Tháng này"]
                dataMonth.datasets = [{
                    data: [
                        (sumLastMonth/1000000).toFixed(2) == 0 ? Number((sumLastMonth/1000000).toFixed(2)).toFixed(2) : Number(-(sumLastMonth/1000000).toFixed(2)).toFixed(2), 
                        (sum/1000000).toFixed(2) == 0 ? Number(sum/1000000).toFixed(2) : Number(-(sum/1000000).toFixed(2)).toFixed(2)
                    ]
                }]
                dataMonth.valuesChiTieu = valuesChiTieu

                res.json({
                    status: true,
                    mes:"Lấy giao dịch trong tháng thành công",
                    data: dataMonth
                })

            }
            
        } catch (error) {
            console.error("Lỗi lấy giao dịch trong tháng:", error);
        }
    }

    async mosttradeweek(req, res){
        const data = req.query
        const date = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00.000Z')
        const thisWeek = HelpDate.thisweek(date)
        const dateLastWeek = new Date((new Date(thisWeek[0] - 1)).toISOString().split('T')[0] + 'T00:00:00.000Z')
        const lastWeek = HelpDate.thisweek(dateLastWeek)

        try {
            let alltrade = await Trade.find({ 
                fromId: req.fromId,
                date:{
                    $gte: thisWeek[0],
                    $lte: thisWeek[1]
                },
                money: {$lt: 0} 
            })

            let alltradelastmonth = await Trade.find({ 
                fromId: req.fromId,
                date:{
                    $gte: lastWeek[0],
                    $lte: lastWeek[1]
                },
                money: {$lt: 0} 
            })
            let sumLastWeek = alltradelastmonth.reduce((acc, trade) => acc + trade.money, 0)

            let traderecent = await Trade.find({ 
                fromId: req.fromId,
                date:{
                    $gte: thisWeek[0],
                    $lte: thisWeek[1]
                },
                money: {$lt: 0}
            }).populate('groupId').populate('walletId').sort({ money: 1 }).limit(3)

            if (traderecent) {
                let dataWeek = {}
                let valuesChiTieu = []
                let sum = alltrade.reduce((acc, trade) => acc + trade.money, 0)

                traderecent.map(trade => {
                    let obj = {}
                    let percent = trade.money / sum

                    obj.money = -trade.money
                    obj.percent = (percent * 100).toFixed(0) + '%'
                    obj.group = trade.groupId
                    obj.wallet = trade.walletId
                    valuesChiTieu.push(obj)
                })

                dataWeek.sum = -sum
                dataWeek.labels = [ "Tuần trước", "Tuần này"]
                dataWeek.datasets = [{
                    data: [
                        (sumLastWeek/1000000).toFixed(2) == 0 ? Number((sumLastWeek/1000000).toFixed(2)).toFixed(2) : Number(-(sumLastWeek/1000000).toFixed(2)).toFixed(2), 
                        (sum/1000000).toFixed(2) == 0 ? Number((sum/1000000)).toFixed(2) : Number(-(sum/1000000).toFixed(2)).toFixed(2)
                    ]
                }]
                dataWeek.valuesChiTieu = valuesChiTieu

                res.json({
                    status: true,
                    mes:"Lấy giao dịch trong tuần thành công",
                    data: dataWeek
                })

            }
            
        } catch (error) {
            console.error("Lỗi lấy giao dịch trong tuần:", error);
        }
    }

    async trademonths(req, res) { 
        const data = req.query
        const months = HelpDate.getStartAndEndDatesOfPastFourMonths(data.numbermonth)
        try {
            let result = await Promise.all(months.map(async (month) => {
                let obj = {}
                let trades = await Trade.find({
                    fromId: req.fromId,
                    walletId: data.walletId,
                    date:{
                        $gte: month[0],
                        $lte: month[1]
                    },
                }).populate('groupId').populate('walletId')

                if (trades) {
                    let moneyin = trades.filter(trade => trade.money > 0).map(trade => trade.money).reduce((sum, money) => sum + money, 0)
                    let moneyout = trades.filter(trade => trade.money < 0).map(trade => trade.money).reduce((sum, money) => sum + money, 0)
                    let dataday = []

                    while (trades.length > 0) {
                        const current = trades[0];
                        let obj = {}
                        const trade = [];
                        
                        for (let i = trades.length - 1; i >= 0; i--) {
                            if (HelpDate.isSameDate(trades[i].date, current.date)) {
                                trade.push(trades[i]);
                                trades.splice(i, 1);
                            }
                        }
                        
                        obj.date = current.date.toISOString().split('T')[0]
                        obj.detail = trade
                        dataday.push(obj);
                    }  
                    dataday.sort((a, b) => new Date(b.date) - new Date(a.date));

                    obj.title =  HelpDate.checkMonthYear(HelpDate.getMonthYear(month[1],'sort'))
                    obj.moneyin = moneyin
                    obj.moneyout = -moneyout
                    obj.data = dataday
                    return obj
                }
                
            }))

            let tradefuture = await Trade.find({
                fromId: req.fromId,
                walletId: data.walletId,
                date:{
                    $gt: months[months.length - 1][1],
                },
            }).populate('groupId')

            let objft = {}
            let moneyintl = tradefuture.filter(trade => trade.money > 0).map(trade => trade.money).reduce((sum, money) => sum + money, 0)
            let moneyoutyl = tradefuture.filter(trade => trade.money < 0).map(trade => trade.money).reduce((sum, money) => sum + money, 0)
            let datadaytl = []
            
            while (tradefuture.length > 0) {
                const currenttl = tradefuture[0];
                let objtl = {}
                const tradetl = [];
                
                for (let i = tradefuture.length - 1; i >= 0; i--) {
                    if (HelpDate.isSameDate(tradefuture[i].date, currenttl.date)) {
                        tradetl.push(tradefuture[i]);
                        tradefuture.splice(i, 1);
                    }
                }
                
                objtl.date = currenttl.date.toISOString().split('T')[0]
                objtl.detail = tradetl
                datadaytl.push(objtl);
            }  

            datadaytl.sort((a, b) => new Date(b.date) - new Date(a.date));

            objft.title = 'Tương lai'
            objft.moneyin = moneyintl
            objft.moneyout = -moneyoutyl
            objft.data = datadaytl
            result.push(objft)
                
            res.json({
                status: true,
                mes: 'Lấy giao dịch các tháng',
                data: result
            })

        } catch (error) {
            console.error("Lỗi lấy giao dịch các tháng:", error);
        }
    }

    async tradreports(req, res) { 
        const data = req.query
        const months = HelpDate.getStartAndEndDatesOfPastFourMonths(data.numbermonth)
        try {
            let result = await Promise.all(months.map(async (month) => {
                let obj = {}
                let objdata = {}
                let objdatadong = {}

                let trades = await Trade.find({
                    fromId: req.fromId,
                    walletId: data.walletId,
                    date:{
                        $gte: month[0],
                        $lte: month[1]
                    },
                }).populate('groupId')

                if (trades) {
                    let sum = trades.reduce((acc, trade) => acc + trade.money, 0)
                    let rangetime = HelpDate.splitMonthobj(month[0].getFullYear(), month[0].getMonth() + 1)

                    obj.title =  HelpDate.checkMonthYear(HelpDate.getMonthYear(month[1],'sort'))
                    objdatadong.sum = sum
                    objdatadong.labels = HelpDate.splitMonth(month[0].getFullYear(), month[0].getMonth() + 1)
                        
                    let datasetdong = await Promise.all(rangetime.map(async(time) => {
                        let trades =  await Trade.find({
                            fromId: req.fromId,
                            walletId: data.walletId,
                            date:{
                                $gte: time[0],
                                $lte: time[1]
                            },
                        })
                        return Number(trades.reduce((total, item) => total = total + item.money, 0)/1000000).toFixed(2)
                    }))    
                    
                    objdatadong.datasets = [{data: datasetdong}]
                    objdata.datadong = objdatadong

                    let datathu =  await Trade.find({
                        fromId: req.fromId,
                        walletId: data.walletId,
                        money: {$gt: 0},
                        date:{
                            $gte: month[0],
                            $lte: month[1]
                        },
                    }).populate('groupId')

                    let datachi = await Trade.find({
                        fromId: req.fromId,
                        walletId: data.walletId,
                        money: {$lt: 0},
                        date:{
                            $gte: month[0],
                            $lte: month[1]
                        },
                    }).populate('groupId')

                    let listthu = []
                    let listchi = []

                    while (datathu.length > 0) {
                        const currentthu = datathu[0];
                        let objthu = {}
                        const tradethu = [];
                        
                        for (let i = datathu.length - 1; i >= 0; i--) {
                            if (datathu[i].groupId.name === currentthu.groupId.name) {
                                tradethu.push(datathu[i]);
                                datathu.splice(i, 1);
                            }
                        }
                        objthu.name = currentthu.groupId.name
                        objthu.population = tradethu.reduce((total, item) => total + item.money, 0),
                        objthu.color = HelpColor.randomColorFromBaseColor(),
                        objthu.legendFontColor = "#7F7F7F",
                        objthu.legendFontSize = 14
                        listthu.push(objthu);
                    } 

                    while (datachi.length > 0) {
                        const currentchi = datachi[0];
                        let objchi = {}
                        const tradechi = [];
                        
                        for (let i = datachi.length - 1; i >= 0; i--) {
                            if (datachi[i].groupId.name === currentchi.groupId.name) {
                                tradechi.push(datachi[i]);
                                datachi.splice(i, 1);
                            }
                        }
                        objchi.name = currentchi.groupId.name
                        objchi.population = tradechi.reduce((total, item) => total + item.money, 0),
                        objchi.color = HelpColor.randomColorFromBaseColor(),
                        objchi.legendFontColor = "#7F7F7F",
                        objchi.legendFontSize = 14
                        listchi.push(objchi);
                    }

                    let datacolora = ['#A4CABC', '#EAB364', '#B2473E']
                    let a = listthu.sort((a,b) => b.population - a.population).slice(0,3)
                    for (const item of a) {
                        item.color = datacolora.pop()
                    }

                    let datacolorb = ['#A4CABC', '#EAB364', '#B2473E']
                    let b = listchi.sort((a,b) => a.population - b.population).slice(0,3)
                    for (const item of b) {
                        item.color = datacolorb.pop()
                    }

                    if (listthu.length >= 4){
                        a.push({
                            name: 'Khác',
                            population: listthu.sort((a,b) => b.population - a.population).slice(3, listthu.length).reduce((total, item) => total + item.population, 0),
                            color: '#ACBD78',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 14
                        })
                    }
                    
                    if (listchi.length >= 4){
                        b.push({
                            name: 'Khác',
                            population: listchi.sort((a,b) => a.population - b.population).slice(3, listchi.length).reduce((total, item) => total + item.population, 0),
                            color: '#ACBD78',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 14
                        })
                    }

                    objdata.datathu = a
                    objdata.datachi = b

                    obj.data = objdata
                    return obj
                }
            }))
            res.json({
                status: true,
                mes: 'Lấy báo cáo giao dịch các tháng',
                data: result
            })
        } catch (error) {
            console.error("Lỗi lấy báo cáo giao dịch ", error);
        }
    }

    async tradreportdetail(req, res) { 
        const data = req.query
        const months = HelpDate.getStartAndEndDatesOfPastFourMonths(data.numbermonth)
        try {
            let result = await Promise.all(months.map(async (month) => {
                let obj = {}

                if (data.type == 0) {
                    var trades = await Trade.find({
                        fromId: req.fromId,
                            walletId: data.walletId,
                            money: {$lt: 0},
                            date:{
                                $gte: month[0],
                                $lte: month[1]
                            },
                    }).populate('groupId').populate('walletId')
                }
                else{
                    var trades = await Trade.find({
                        fromId: req.fromId,
                            walletId: data.walletId,
                            money: {$gt: 0},
                            date:{
                                $gte: month[0],
                                $lte: month[1]
                            },
                    }).populate('groupId').populate('walletId')
                }
                
                if (trades) {
                    obj.title =  HelpDate.checkMonthYear(HelpDate.getMonthYear(month[1],'sort'))
                    data.type == 0 ? obj.data = [...trades].sort((a,b) => a.money - b.money) : obj.data = [...trades].sort((a,b) => b.money - a.money)

                    let listthu = []

                    while (trades.length > 0) {
                        const currentthu = trades[0];
                        let objthu = {}
                        const tradethu = [];
                        
                        for (let i = trades.length - 1; i >= 0; i--) {
                            if (trades[i].groupId.name === currentthu.groupId.name) {
                                tradethu.push(trades[i]);
                                trades.splice(i, 1);
                            }
                        }
                        objthu.name = currentthu.groupId.name
                        objthu.population = tradethu.reduce((total, item) => total + item.money, 0),
                        objthu.color = HelpColor.randomColorFromBaseColor(),
                        objthu.legendFontColor = "#7F7F7F",
                        objthu.legendFontSize = 14
                        listthu.push(objthu);
                    } 

                    if (data.type == 0) {
                        var a = listthu.sort((a,b) => a.population - b.population).slice(0,3)
                    }
                    else{
                        var a = listthu.sort((a,b) => b.population - a.population).slice(0,3)
                    }

                    let datacolor = ['#A4CABC', '#EAB364', '#B2473E']
                    for (const item of a) {
                        item.color = datacolor.pop()
                    }

                    if (listthu.length >= 4){
                        a.push({
                            name: 'Khác',
                            population: data.type == 0 ? 
                                listthu.sort((a,b) => a.population - b.population).slice(3, listthu.length).reduce((total, item) => total + item.population, 0):
                                listthu.sort((a,b) => b.population - a.population).slice(3, listthu.length).reduce((total, item) => total + item.population, 0),
                            color: '#ACBD78',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 14
                        })
                    }
                    
                    obj.datachar = a
                    return obj
                }

            }))
            res.json({
                status: true,
                mes: 'Lấy báo cáo giao dịch các tháng',
                data: result
            })
        } catch (error) {
            console.error("Lỗi lấy báo cáo giao dịch chi tiết ", error);
        }
    }
}

module.exports = new TradesController;