const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalmongoose = require("passport-local-mongoose");

//local mongoose is a plugin for mongoose that adds username and password to the schema
const userSchema=new Schema({
    email:{
        type:String,
        required:true,

    }
})

userSchema.plugin(passportLocalmongoose); //passportLocalmongoose plugin automatic add username, password,hashing ,saltig and hashpassword

module.exports=mongoose.model("User",userSchema);
