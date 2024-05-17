const express = require("express");
var router = express.Router()

const BudgetsController = require('../controllers/BudgetsController')

router.get('/getbudgets',BudgetsController.getbudgets)
router.post('/addbudget',BudgetsController.addbudget)
router.delete('/delebudget',BudgetsController.delebudget)
router.put('/changebudget',BudgetsController.changebudget)
router.get('/mybudget',BudgetsController.mybudget)

router.get('/test',BudgetsController.test)

router.get('/',BudgetsController.index)

module.exports = router