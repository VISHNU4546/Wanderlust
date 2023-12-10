
const User = require("../models/user");

module.exports.signup = async(req,res,next)=>{
    try{
      let {username,email,password} = req.body;
      const newUser = new User({email,username});
  
   let registerUser = await User.register(newUser,password);
   req.login(registerUser,(err)=>{
   if(err){
    return next(err);
   }
   req.flash('success',"Welcome to Wanderlust!");
   res.redirect("/listings");
   })
  
    }
    catch(err){
     req.flash("error" ,err.message);
     res.redirect("/signup");
    }
  };