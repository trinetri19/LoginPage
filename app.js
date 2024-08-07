const express = require('express')
const app = express()
const port = 8080;
const routeUser = require('./routes/user')
const ejsMate = require('ejs-mate')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const MethodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/userModel')
const ExpressError  = require('./views/utils/ExpressError')
const flash = require('connect-flash')

main().then(()=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log(err)
})

 async function main(){
    await mongoose.connect(process.env.MONGODB_URL)
 }



 const store = MongoStore.create({
    mongoUrl:process.env.MONGODB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 * 3600
})
store.on("error",()=>{
    console.log("store error")
})


 const sessionObject = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(MethodOverride("_method"))
app.use(express.urlencoded({ extended: true }));
app.set("views",path.join(__dirname,'views'));
app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.use(session(sessionObject))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    next()
})

app.use("/api/Page",routeUser)



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "PAGE NOT FOUND"));
})

app.use((err, req, res, next) => {
    let { statusCode = 404, message = "Oops! Something Went Wrong" } = err
    res.render("pages/error.ejs", { message })
})

app.listen(port,()=>{
    console.log("server is listening");
})

