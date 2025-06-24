const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");

const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })  //ye batata hai image ko kaha par upload karna hai ,yaha par cloudinary ki storage main jakar save ho raha hai

//listing routes

router.route("/")
      //listing index route
     .get(wrapAsync(listingController.index))  
     //create route  
    //  .post(isLoggedIn,validateListing,upload.single('listing[image][url]'),wrapAsync(listingController.createListing)) // pahle validate fir aange ka kaam karaynge
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)) // pahle validate fir aange ka kaam karaynge
     

 //new route
 router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm))  //new route put above the ":/id" route, because yadi neeche rakha toh new bali request id bale router main chali jygi and new ko id ki taray DB main seach karega

 router.route("/:id")
     .get(wrapAsync(listingController.showListings))   //show route
     .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing))    //update route
     .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.distroyListing))   //delete route

 //edit route
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))
 
 module.exports=router   //export router object