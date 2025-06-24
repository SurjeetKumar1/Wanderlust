if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}   
const express=require("express");
const mongoose=require("mongoose");
const path=require("path")
const methodOverrid=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const cookieParse=require("cookie-parser");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/users.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

// const dburl='mongodb://127.0.0.1:27017/wanderlust';
const dburl=process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log("Database connection error:", err);
});

async function main(){
    await mongoose.connect(dburl)
}

const app=express();
const port=8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverrid("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
app.use(cookieParse("secretcode"));

const store=MongoStore.create({ 
    mongoUrl:dburl,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter:24*3600 //24 hr->milisecond
 })

store.on("errer",()=>{      // if any error occur in mongo session store them it display it;
    console.log("error in MONGO SESSION STRORE",err);
})

const sessionOptions={
    store,  // session storage store in atlas DB
    secret: process.env.SECRET,
    resave :false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


app.use(session(sessionOptions));   //password sessions kon bhi use karta hai, taki same user ke liye baar baar login na karaye
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // pasword ke under jo bhi nahi local stratigyke throuh othenticate hone chahiye  and un user ko authenticate karne ke liye authenticate methode use
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; 
    next();
})

app.use("/",userRouter);
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);


// yadi kisi route ke sath request match na kare then this route will call
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page not found!"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(port,()=>{
    console.log("server is listing on port: ",port);
})