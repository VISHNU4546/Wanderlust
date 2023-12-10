const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../middleware/wrapAsync");
const passport = require("passport");
const{savedRedirectUrl} = require("../middleware/middleware");
const {signup} =require("../controller/user") 
const  ExpressError =  require("../middleware/ExpressError")

router.get("/signup",(req,res)=>{
    res.render("users/signUp.ejs");
})


router.post("/signup", wrapAsync(signup));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",savedRedirectUrl,passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}), async(req,res)=>{
    req.flash("success",'Welcome back to Wanderlust!');
  let redirectUrl = res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
     if(err){
     return next(err);
     }
     req.flash("success","you are logged out !");
     res.redirect("/listings");
  })
});
module.exports = router;