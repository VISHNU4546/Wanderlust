if(process.env.NODE_ENV !='producation'){
    require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const  ExpressError =  require("./middleware/ExpressError")
const listingsRouter =require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const session = require("express-session");
const  MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy =  require("passport-local");
const User = require("./models/user");



const app = express();
let PORT = 8080;
// let MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;
app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.set("view engine",'ejs');
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));                   
app.use(express.json());

mongoose.connect(dbUrl).then((res)=>{
        console.log("connected to DB ")})
        .catch((err)=>{
                console.log(err);
            });

            const store = MongoStore.create(
                {
                   mongoUrl:dbUrl,
                   crypto:{
                    secret:process.env.SECRET,
                   },
                   touchAfter:24*3600
                }
            )
            store.on("error",()=>{
                console.log("Error in MONGO SESSION STORE")
            })
            //Session Option
const sessionOtp = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
}  

// app.get("/",(req,res)=>{
//     res.send("I am root");
// })



//Flash Mesaage
app.use(flash());
app.use(session(sessionOtp));  
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//to Store user in session
passport.deserializeUser(User.deserializeUser());//to destroye user in session

app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;
next();
})

//Demo User
// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User ({
//    email:"abc@4545g.com",
//    username:"delta",
//     });

//   let registerUser= await User.register(fakeUser,"helloWorld")//to register user with user and password
//   res.send(registerUser);
// })


// all lisings routes
app.use("/listings",listingsRouter);

//all review routes
app.use("/listings/:id/reviews",reviewRouter);

//user Router
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"))
})

app.use((err,req,res,next)=>{
    let{statusCode =500,message ='something went wrong!'} = err;
    res.status(statusCode).render("error",{err});
    // res.status(statusCode).send(message);
})
app.listen(PORT,()=>{
    console.log(`Server Started At port:-${PORT}`);
});