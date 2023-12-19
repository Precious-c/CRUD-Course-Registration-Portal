const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth')

console.log("Home Route")

//Home Router
router.get('/', homeController.getIndex)
// router.get('/createProfile', createProfileController)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/createProfile', authController.getCreateProfile)
router.post('/createProfile', authController.postCreateProfile)

module.exports = router