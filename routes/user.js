const express=require("express");
const router=express.Router();
const User=require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")

const userController=require("../controllers/users.js")

//signup routes
router.route("/signup")
     .get(userController.renderSignupForm)
     .post(wrapAsync(userController.signup))

//login routes
router.route("/login")
     .get(userController.renderLoginForm)
     .post(
     saveRedirectUrl,
     passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),
     userController.login)    //passposrt.authenticate(), ek middleware hai jo login se pahle authentication ke liye use hota hai 

//logout route
router.get("/logout",userController.logout)

module.exports=router;