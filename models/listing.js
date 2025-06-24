const mongoose=require("mongoose");
const { listingSchema } = require("../schema");
const Schema=mongoose.Schema;
const Review=require("./review");
const { ref } = require("joi");
const User=require("./users")

const ListingSchema=new Schema({
    title:{
        type:String,
        requires:true,
    },
    description:{
        type:String,
    },
    image: {
        url:String,
        filename:String
    },
    price:{
        type:Number,

    },
    location:{
        type:String,
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
    },
    geometry:{
        type: {
            type: String, // Don't do `{ geometry: { type: String } }`
            enum: ['Point'], // 'geometry.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    category: {
        type: String,
        enum: [
          "trending",
          "rooms",
          "iconicCities",
          "mountains",
          "castles",
          "amazingPools",
          "camping",
          "farms",
          "arctic",
          "domes",
          "beach",
        ]
      }
})

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        let res=await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Lisiting=mongoose.model("Listing",ListingSchema);

module.exports=Lisiting;
