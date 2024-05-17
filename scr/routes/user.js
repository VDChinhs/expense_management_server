const express = require("express");
var router = express.Router()
const walletsRouter = require('./wallet')
const tradesRouter = require('./trade')
const budgetsRouter = require('./budget')
const groupsRouter = require('./group')

const usersController = require('../controllers/UsersController')

router.get('/getusers', usersController.getusers);
router.put('/changepassword', usersController.changepassword)
router.delete('/deleacc', usersController.deleacc)

router.use('/wallet', walletsRouter)
router.use('/group', groupsRouter)
router.use('/trade', tradesRouter)
router.use('/budget', budgetsRouter)

router.get('/',usersController.index)


module.exports = router