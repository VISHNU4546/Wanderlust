const Listing = require("../models/listing");
const  mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient= mbxClient({ accessToken:mapToken });

//index route
module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("index",{allListings})
    }


//show route
module.exports.show = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate(
     {path:'review',
     populate:{  path:"author", }})
   .populate("owner");
    if(!listing){
     req.flash("error","Listing does not exists");
     res.redirect('/listings');
    }
    res.render("show",{listing});
    }

module.exports.create = async(req,res,next)=>{

  const url = req.file.path;
  const filename = req.file.filename;
  let reponse = await  geocodingClient.forwardGeocode({
        query: req.body.listings.location,
        limit: 1
      })
        .send();

    //    res.send("done");
     
    let newlistings = new Listing(req.body.listings);
    newlistings.geometry = reponse.body.features[0].geometry;
    // console.log( newlistings.geometry);
    
    
    newlistings.owner = req.user._id;
    newlistings.image =url;
    // console.log(newlistings);
   await newlistings.save();
   req.flash("success"," New  Listing Created");
      res.redirect("/listings");

 }  ;
 
 
 module.exports.edit  =async(req,res)=>{
    let {id} = req.params;
   
    const listing = await Listing.findById(id);
    if(!listing){
     req.flash("error","Listing you request does not exists");
     res.redirect('/listings');
    }
  res.render("edit",{listing});
};

module.exports.update = async(req,res)=>{
    let {id} = req.params;
    console.log(req.body.listings)
    let reponse = await  geocodingClient.forwardGeocode({
      query: req.body.listings.location,
      limit: 1
    })
      .send();
      req.body.listings.geometry = reponse.body.features[0].geometry;
      
    
   let listing = await Listing.findByIdAndUpdate(id,{...req.body.listings}); 
  //  if(typeof(req.file !== "undefined")){
  //   let url = req.file.path;
  //   listing.image =url;
  //   await listing.save();
  //  }
   req.flash("success","   Listing Updated!");
   res.redirect(`/listings/${id}`);
};

module.exports.Delete = async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success"," Listing Deleted !");
   res.redirect("/listings");
}