const User=require("../models/users");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{                                             //yaha par tey catch lagane ka fayda, if any error occur then catch block handle it,yadi try catch nahi lagate toh wrapAsync handle kar leta 
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust!");
            res.redirect("/listings");
        })
    }catch(err){
      req.flash("error",err.message);
      res.redirect("/signup")
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")

}

module.exports.login=async(req,res)=>{ //login bala kaam passport kara raha hai ye lgoin function toh bata raha hai after successfull, what should  we show
    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
     if(err){
        return next(err);         //if logout hote samaye koi error ayi then call next(err);
     }
     req.flash("success","you are logged out!")
     res.redirect("/listings");
    })
}