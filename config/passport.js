const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
passport.use(new LocalStrategy({
  usernameField: 'matricNum',
  passwordField: 'password'
}, async (matricNum, password, done) => {
  try {
    const user = await User.findOne({ matricNum: matricNum });
    if (!user) {
      return done(null, false, { message: `Student with ${matricNum} not found.` });
    }
    if (!user.password) {
      return done(null, false, { message: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
    }
    
    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Invalid matric or password.' });
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      done(err)
    })
})
}