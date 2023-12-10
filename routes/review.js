const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../middleware/wrapAsync");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware/middleware")
const {create,Delete} = require("../controller/review");
const  ExpressError =  require("../middleware/ExpressError");

//post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(create));

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(Delete));

module.exports = router;