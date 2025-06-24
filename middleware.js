const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js")


module.exports.isLoggedIn=(req,res,next)=>{     // isLoggedin is a function
    if(!req.isAuthenticated()){             //isAuthenticated return true or false: if true means user is authenticated
         req.session.redirectUrl= req.originalUrl;       //redirected save
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
      }
      next();         // if userAuthenticated then call next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; 
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{  //isOwner funtion ka kaam, jo bhi curr user hai kya bo listing ka owner hai ya nahi
    let {id}=req.params;
     let listing=await Listing.findById(id);
     if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
     }
  next() // next call nahi kiya toh middleware yahi stuck ho jayga
}

module.exports.validateListing=(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",") ;
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",") ;
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{  //isOwner funtion ka kaam, jo bhi curr user hai kya bo listing ka owner hai ya nahi
    let {id,reviewId}=req.params;
     let review=await Review.findById(reviewId);
     if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","you are not the author of this review");
        return res.redirect(`/listings/${id}`);
     }
  next() // next call nahi kiya toh middleware yahi stuck ho jayga
}
