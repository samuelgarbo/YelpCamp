const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/campground");
const middleware = require("../middleware");

// INDEX
router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});        
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from request and add to array
    let name = req.body.name;
	let price = req.body.price;
    let image = req.body.image; 
	let description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
    let newCampground = {name:name, price: price, image: image, description: description, author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else {
		 //redirect back to campgrounds page
			res.redirect("campgrounds/");		
		}
	});
   
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW 
router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else {
			
			//render show template
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});				
		});		
});
//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground
	//redirect somewhere(show page)
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else {
			res.redirect("/campgrounds/" + req.params.id);
		}
		
	});
	
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
		if(err){
			res.redirect("/campgrounds");
		}else {
			Comment.deleteMany({_id: { $in: campgroundRemoved.comments} }, function(err){
				if(err) {
					console.log(err);
				}
				res.redirect("/campgrounds");
			});
	}
	});
});


module.exports = router;