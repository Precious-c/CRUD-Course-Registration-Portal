const Course = require('../models/Course.js')

module.exports = {
        registeredCoursesList: async (request, response) => {
            try {
                const registeredCourses = await Course.find()
                response.render('courses.ejs', {info: registeredCourses})
            }catch(err){
                console.error(err)
            } 
        },

        addCourse: async (request, response) => {
            try{     
                const courses = await Course.countDocuments()
                    if(courses < 12){
                        await Course.create({courseCode: request.body.courseCode, courseTitle: request.body.courseTitle, cr: request.body.cr})
                        console.log('Added Succesully')
                        response.redirect('/registerCourse')
                    } else {
                        response.status(500).send("You can only register 11 Courses")
                    }
            }catch(err) {
                console.log(err)
                response.status(500).send('Internal Server Error, Please check your inputs')
            }
        },

        deleteCourse: async(request, response) => {
            try {
                await Course.findOneAndDelete({courseTitle: request.body.courseTitle})
                console.log('Deleted Successully')
                response.json('Deleted Successully')  
            } catch(err) {
                console.error(err)
            }
        }
}