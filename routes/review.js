const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review");
const Listing=require("../models/listing");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")


//reviews routes
//reviews post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.distroyReview))

module.exports=router;