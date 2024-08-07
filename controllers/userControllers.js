const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/userModel')

exports.homePage = async  (req,res)=>{
    let {id} = req.params
    let user = await User.findById(id)
    res.render('pages/home.ejs' , {user})
}


exports.userLogin = (req,res) =>{
   res.render("pages/login.ejs")
}

exports.userRegister = (req,res)=>{
    res.render('pages/register.ejs')
}

exports.LoginPost = async  (req, res) => {
    let {username} = req.body
    const user = await User.findOne({username : username})
    req.flash(`success` , `You are Logged in `)
    res.redirect(`/api/Page/home/${user._id}`)
    }


exports.registerPost = async  (req,res,next) =>{
    try {
        let { email, username, password } = req.body
        const newUser = new User({ email, username })
        const registerdUser = await User.register(newUser, password)
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash(`success`,`Welcome ${registerdUser.username}!`)
            res.redirect(`/api/Page/home/${registerdUser._id}`)
        })

    } catch (err) {
        req.flash('error',err.message)
        res.redirect("/api/Page/register")
    }
}


exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if ((err) => {
            return next(err)
        })
        req.flash(`success` , `You are LogOut   `)
        res.redirect("/api/Page/register")
    })
}