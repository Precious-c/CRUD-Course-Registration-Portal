const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 3131
require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(express.json())
app.set('view engine', 'ejs')

//Database credentials -- 
let db
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'course_registration_b'

//Connecting to database
MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)

        //Router to /
        app.get('/', (request, response) => {
            // console.log('Received GET request to /')
            db.collection('courses').find().toArray()
            .then(data => {
                response.render('index.ejs', {info: data})
            })
            .catch(error => console.error(error))   
        })

        app.post('/addCourse', async (request, response) => {
            // console.log('Received POST request to /addCourse')      
            db.collection('courses').countDocuments()
            .then(result => {
                if(result < 12){
                    db.collection('courses').insertOne({courseCode: request.body.courseCode, courseTitle: request.body.courseTitle, cr: request.body.cr})
                    .then(result => {
                        console.log('Added Succesully')
                        response.redirect('/')
                    })
                    .catch(error => console.error(error))
                } else {
                    response.status(500).send("You can only register 11 Courses")
                }
            })
            .catch(error => {
                console.log(error)
                response.status(500).send('Internal Server Error')
            })
        })

        app.delete('/deleteCourse', (request, response) => {
            db.collection('courses').deleteOne({courseTitle: request.body.courseTitle})
            .then( result => {
                console.log('Deleted Successully')
                response.json('Deleted Successully')  
            })
            .catch(error => console.error(error))
        })
        
        app.listen(process.env.PORT || PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })





