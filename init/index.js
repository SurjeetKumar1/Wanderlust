const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing");
// console.log(data);
const url='mongodb://127.0.0.1:27017/wanderlust'
main().then((res)=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(url)
}
// console.log(initData.data);
const initDB=async()=>{
    await Listing.deleteMany({});  // pahle se data exist then delete it first
  initData.data=  initData.data.map((obj)=>({...obj,owner:"68556df1e6a578ba0b781101"})) //convert lod object to new object with this owner property
    await Listing.insertMany(initData.data)
    console.log("data was initialized");
}
initDB();