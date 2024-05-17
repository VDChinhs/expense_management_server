const express = require("express");
var router = express.Router()

const testController = require('../controllers/TestController')

router.post('/login',testController.login);

router.post('/sign',testController.sign);

router.get('/:slug', testController.index);

module.exports = router