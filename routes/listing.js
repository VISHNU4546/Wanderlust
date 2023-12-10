const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../middleware/wrapAsync");
 const {isLoggedIn,isOwner,validateListing} = require("../middleware/middleware");
const{index,show,create,edit,update,Delete} = require("../controller/listings");
const  ExpressError =  require("../middleware/ExpressError");
const  multer = require("multer");
const{storage} = require("../cloudConfig");
const upload = multer({storage})

//index Route

router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn,
   upload.single('listings[image]'),validateListing,
   wrapAsync(create)
   );

   
   
   //new Route
   router.get("/new",isLoggedIn,(req,res)=>{
   
   res.render("new");
       
   })
   //show route
   router.get("/:id",wrapAsync(show)
   )
   
   
   
   //edit route
   router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(edit));
   
   //Update route
   router.put("/:id",isLoggedIn,isOwner
   ,validateListing,wrapAsync(update)
   );
   
   //delete route
   router.delete("/:id",isLoggedIn,isOwner,wrapAsync(Delete)
   );

  module.exports = router;