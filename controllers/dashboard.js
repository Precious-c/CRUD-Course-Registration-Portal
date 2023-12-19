const Course = require('../models/Course.js')
const User = require('../models/User.js')

module.exports = {
        registeredCoursesList: async (request, response) => {
            try {
                const user = request.user.id
                const registeredCourses = await Course.find( {registeredBy:user} )
                const emptySlots = await Course.countDocuments( { registeredBy: user })
                response.render('dashboard.ejs', {info: registeredCourses, emptySlots: 12 - emptySlots, user: request.user})
            }catch(err){
                console.error(err)
            } 
        },

        addCourse: async (request, response) => {
            try{     
                const user = request.user.id
                const coursesCount = await Course.countDocuments( {registeredBy: user })
                    if(coursesCount < 12){
                        await Course.create({courseCode: request.body.courseCode, courseTitle: request.body.courseTitle, cr: request.body.cr, registeredBy: user})
                        const updatedUser = await User.findByIdAndUpdate(user ,{
                            $inc: {
                                noOfCoursesRegistered: 1,
                                noOfCoursesLeft: -1
                            },
                            $push: {
                                courses: request.body.courseTitle
                            },
                         })
                        console.log('Added Succesully')
                        response.redirect('/dashboard')
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
        },

        logout: async(request, response, next) => {
            try {
                request.logout(function(err) {
                    if (err) { return next(err); }
                    console.log('User logged out successully')
                    response.redirect('/');
                });
            } catch(err) {
                console.error(err)
            }
        }
}