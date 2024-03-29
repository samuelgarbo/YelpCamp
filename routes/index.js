const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});

//============
//AUTH ROUTES
//============

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//registration
router.post("/register",function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			res.render("register");
			return;
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp "+ user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
		res.render("login");
});

//login
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
		
	});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});


module.exports = router;