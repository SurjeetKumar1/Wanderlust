// these all are callback for listings

const Listing=require("../models/listing.js")

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding') // mapbox main kafi services hai but we use geocoding
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //map token ko use karke base client ko create karenge
//geocodingClient means ek yesi functinality/object aa gaya jo geocoding related kuch kaam karke dega


module.exports.index=async(req,res)=>{      //index is async funtion jiska kaam saari ki saari listings ko render karana
   const { category, search } = req.query;
   let queryObj = {};

   if (category) {
       queryObj.category = category;
   }

   if (search && search.trim() !== "") {
       const searchRegex = new RegExp(search.trim(), "i");
       queryObj.$or = [
           { country: searchRegex },
           { location: searchRegex }
       ];
   }

   const allListings = await Listing.find(queryObj);

   // If no listings found, render error.ejs with a message
   if (allListings.length === 0) {
      return res.render("listings/notfound.ejs", {
        search,
        category
      });
   }

   // Otherwise render listings page
   res.render("listings/index.ejs", { allListings, category, search });
};

 module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
   const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
   if(!listing){
       req.flash("error","Listing you are requested is not exist");
       return res.redirect("/listings");
   }
   res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async(req,res,next)=>{ 
    
   let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send()

    let url=req.file.path;
    let filename=req.file.filename
     let newlisting=new Listing(req.body.listing);
     newlisting.owner=req.user._id; 
     newlisting.image={url,filename}
     newlisting.geometry=response.body.features[0].geometry; //returns geometry of corresponding location

     let savesListing=await newlisting.save();
   //   console.log(savesListing);
     req.flash("success","New Listing Created");
     res.redirect("/listings");
 }

 module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you are requested is not exist");
       return res.redirect("/listings");
   }
   let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
   res.render("listings/edit.ejs", { listing, originalImageUrl });
   
}

module.exports.updateListing=async(req,res)=>{
     let {id}=req.params;
     let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
     if(typeof req.file!="undefined"){
     let url=req.file.path;
     let filename=req.file.filename
     listing.image={url,filename}
     await listing.save();
     }

     req.flash("success","Listing Updated");
     res.redirect(`/listings/${id}`);
 }

 module.exports.distroyListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}