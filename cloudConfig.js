const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//cloudinary.config ki help se hamara application cloudinary se connect ho payaga
cloudinary.config({   //cloudinary configuaration main bydefault yahi name hi likhte hai,env file ke variables ka name kuch bhi likh sakhte ho but inka name yahi hoga
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

//CloudinaryStorage batata hai cloudinary ki storage main kis folder main our images are stored
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
    //   format: async (req, file) => 'png', // supports promises as well
    allowedFormate:["png","jpg","jpeg"]
    },
  });

  module.exports={
    cloudinary,
    storage
  }