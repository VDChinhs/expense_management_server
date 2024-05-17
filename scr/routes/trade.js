const express = require("express");
var router = express.Router()

const TradesController = require('../controllers/TradesController')

router.get('/gettrades',TradesController.gettrades)
router.post('/addtrade',TradesController.addtrade)
router.delete('/deletrade',TradesController.deletrade)
router.put('/changetrade',TradesController.changetrade)

router.get('/traderecent', TradesController.traderecent)
router.get('/mosttrademonth', TradesController.mosttrademonth)
router.get('/mosttradeweek', TradesController.mosttradeweek)
router.get('/trademonths', TradesController.trademonths)
router.get('/tradreports', TradesController.tradreports)
router.get('/tradreportdetail', TradesController.tradreportdetail)

router.get('/',TradesController.index)

module.exports = router