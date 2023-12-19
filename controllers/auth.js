const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

exports.getLogin = (req, res) => {
    if(req.user) {
        return res.redirect('/dashboard')
    }
    res.render('login', {
        title: 'Login'
    })
}

exports.postLogin = (req, res, next ) => {
    const validationErrors = []
    if (validator.isEmpty(req.body.matricNum)) validationErrors.push({msg: 'Matric number cannot be blank.'})
    if (validator.isEmpty(req.body.password)) validationErrors.push({msg: 'Password cannot be blank.'})

    console.log(validationErrors)
    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('/login')
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err) }
        if (!user) {
            req.flash('errors', info)
            return res.redirect('/login')
        }
        req.login(user, (err) => {
            if(err) { return next(err) }
            req.flash('success', {msg: 'Success! You are logged in'}) 
            res.redirect(req.session.returnTo || '/dashboard')
        })
    }) (req, res, next)
}

exports.logout = (req, res) => {
    req.logout(() => {
      console.log('User has logged out.')
    })
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
}

exports.getCreateProfile = (req, res) => {
    if (req.user) {
        return res.redirect('/dashboard')
    }
    res.render('createProfile', {
        title: 'Create Account'
    }) 
}

exports.postCreateProfile = (req, res, next) => {
    const validationErrors = []
    if(validator.isEmpty(req.body.name)) validationErrors.push({msg: 'Please enter your name'})
    if(validator.isEmpty(req.body.matricNum)) validationErrors.push({msg: 'Please enter your matric number'})
    if(!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({msg: 'Password must be atleast 8 characters long'})
    if(req.body.password !== req.body.confirmPassword) validationErrors.push({msg: 'Passwords do not match'})
    console.log(validationErrors)
    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('../createProfile')
    }

    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

    const user = new User ({
        name: req.body.name,
        matricNum: req.body.matricNum,
        department: req.body.department,
        noOfCoursesLeft: 12,
        noOfCoursesRegistered: 0,
        email: req.body.email,
        password: req.body.password
    })
    
    User.findOne({ $or: [{ email: req.body.email }, { matricNum: req.body.matricNum }] })
    .exec()
    .then(existingUser => {
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that matric number or email already exists.' });
            return res.redirect('../createProfile');
        }

        // Create a new user instance here...

        // Save the user
        user.save()
            .then(() => {
                req.login(user, err => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/dashboard');
                });
            })
            .catch(err => {
                return next(err);
            });
    })
    .catch(err => {
        return next(err);
    });
}