const express = require("express");
var router = express.Router()

const accountController = require('../controllers/AccountController')

router.post('/sign', accountController.sign)
router.post('/login', accountController.login)

module.exports = router