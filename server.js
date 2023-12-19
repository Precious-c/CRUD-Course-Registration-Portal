const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')

const homeRouter = require('./routes/home')
const dashboardRouter = require('./routes/dashboard')

require('dotenv').config({path: './config/.env'})
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(logger("dev"));

//Sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DB_STRING})
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', homeRouter)
app.use('/dashboard', dashboardRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})