const {listingSchema}= require("../schema");
const {reviewSchema}= require("../schema");
const Listing = require("../models/listing");
const Review = require("../models/review");
const  ExpressError =  require("../middleware/ExpressError")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login...!");
       return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let{id} = req.params;
    let listing =   await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","Permission Denied!")
      return res.redirect(`/listings/${id}`);
    };
    next();
};


module.exports.validateListing = (req,res,next)=>{
    let{error}=  listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg)
         
        
    }
    else{
        next();
    }
};


module.exports.validateReview  = (req,res,next)=>{
    let{error}=  reviewSchema.validate(req.body);
        // console.log(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg)
        
    }
    else{
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let{id,reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author._id.equals(res.locals.currUser._id))
{
    req.flash("error","Aceess Denied!");
    return res.redirect(`/listings/${id}`);
}
next();
}