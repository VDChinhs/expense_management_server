const express = require("express");
var router = express.Router()

const WalletsController = require('../controllers/WalletsController')

router.get('/getwallets',WalletsController.getwallets)
router.post('/addwallet',WalletsController.addwallet)
router.put('/changewallet',WalletsController.changewallet)
router.delete('/delewallet',WalletsController.delewallet)
router.get('/walletfirst',WalletsController.walletfirst)
router.get('/mywallet',WalletsController.mywallet)

router.get('/',WalletsController.index)

module.exports = router