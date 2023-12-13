const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')

//Home Router
router.get('/', homeController.getIndex)

module.exports = router