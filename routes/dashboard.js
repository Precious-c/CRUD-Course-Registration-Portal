const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard')
const { ensureAuth } = require('../middleware/auth')

console.log('Dashboard Route')

router.get('/', ensureAuth, dashboardController.registeredCoursesList)

router.post('/addCourse', dashboardController.addCourse)

router.delete('/deleteCourse', dashboardController.deleteCourse)

router.get('/logout', dashboardController.logout)


module.exports = router