const express = require('express')
const router = express.Router()
const registerCourseController = require('../controllers/registerCourse')

router.get('/', registerCourseController.registeredCoursesList)

router.post('/addCourse', /*() => {
    console.log('addCourse router called') */
    registerCourseController.addCourse
)

router.delete('/deleteCourse', registerCourseController.deleteCourse)

module.exports = router