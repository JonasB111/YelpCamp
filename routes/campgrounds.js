var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // nenurodom index.js failo NES po default, jeigu nurodom tik aplanką, automatiškai ims index failą. cool.

// INDEX - show all campgrounds
router.get("/", function(req, res) {
	// console.log(req.user);
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
		}
	});
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
	// get data from a form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	// v9 different, cleaner way of assigning id values than v8
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = { name: name, price: price, image: image, description: desc, author: author };
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			console.log(newlyCreated);
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground.
// Svarbu kad šitas eitų PO /campgrounds/new, nes tas .../:id, tas :id skaitosi kaip BET KOKS žodis, tai realiai jeigu būtų sukeista vietom, /new atitiktų į :id
router.get("/:id", function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			// console.log(foundCampground);
			res.render("campgrounds/show", { campground: foundCampground });
		}
	});
	// render show template with that campground
});

//  EDIT - show form for campground editing
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", { campground: foundCampground });
	});
});

// UPDATE - send campground edit form data to database
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			// redirect somewhere (show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
