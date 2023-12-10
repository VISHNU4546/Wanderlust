const Review = require("../models/review")
const Listing = require("../models/listing");

module.exports.create = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    let rese = await listing.save();
    // console.log(rese);
    req.flash("success"," New  Review Created !");
    res.redirect(`/listings/${listing._id}`);
    };



    module.exports.Delete = async(req,res)=>{
        let{id,reviewId} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","   Review deleted !");
        res.redirect(`/listings/${id}`);
        
        }