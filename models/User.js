const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
// const { UserSchema } = mongoose

const saltRounds = 10

//Creating the USer Schema
UserSchema = new mongoose.Schema ({
    name: { type: String, required: true },
    matricNum: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    // faculty: { type: String, required: true },
    // level: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    courses: [],
    noOfCoursesLeft: Number,
    noOfCoursesRegistered: Number,
    password: String
})

//Password hash middleware
UserSchema.pre('save', function(next){
    const user = this
    if (!user.isModified('password')) { return next()}
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {return next(err) }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) {return next(err) }
                user.password = hash
                next()
            })
        })
})

//Helper method to validate user's password
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    } catch(err) {
        throw err;
    }
}

//Check if Matric Exists
UserSchema.static('matricExists', async function({matricNum, email}){
    let user = await this.findOne({ matricNum })
    if (user) return { matricNum: 'This matric number already exists' }
    user = await this.findOne({ email })
    if (user) return { email: 'This email address is already in use' }
    return false
})

module.exports = mongoose.model('User', UserSchema)