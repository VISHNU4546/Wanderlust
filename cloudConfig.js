 const cloudinary =  require("cloudinary").v2;
 const{CloudinaryStorage} = require("multer-storage-cloudinary");

 cloudinary.config({
    cloud_name:process.env.CLOUND_NAME,
    api_key:process.env.CLOUND_API_KEY,
    api_secret:process.env.CLOUND_API_SECRET
 });


 const storage = new CloudinaryStorage({ 
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: async (req, file) => ['png','jpg','jpeg'] // supports promises as well
      
    }, 
  });
   
  module.exports = {
    cloudinary,
    storage
  }
