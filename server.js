const express = require('express')
const app = express()
const connectDB = require('./config/database')
const homeRouter = require('./routes/home')
const registerCourseRouter = require('./routes/registerCourse')

require('dotenv').config({path: './config/.env'})

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.use('/', homeRouter)
app.use('/registerCourse', registerCourseRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})