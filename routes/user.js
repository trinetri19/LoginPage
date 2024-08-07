const express = require('express')
const router = express.Router()
const { userLogin,userRegister, homePage, LoginPost, registerPost, logoutUser} = require('../controllers/userControllers')
const passport = require('passport')

router.route('/home/:id').get(homePage)
router.route('/login').get(userLogin).post( passport.authenticate('local', {
    failureRedirect: '/api/Page/login'
}),LoginPost)
router.route('/register').get(userRegister).post(registerPost)
router.route('/logout').get(logoutUser)

module.exports = router