const express = require("express");
var router = express.Router()

const GroupsController = require('../controllers/GroupsController')

router.get('/getgroups',GroupsController.getgroups)
router.post('/addgroup',GroupsController.addgroup)
router.delete('/delegroup',GroupsController.delegroup)
router.put('/changegroup',GroupsController.changegroup)
router.get('/mygroup',GroupsController.mygroup)
router.get('/groupparent',GroupsController.groupparent)

router.get('/test',GroupsController.test)

router.get('/',GroupsController.index)

module.exports = router