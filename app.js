const { render } = require("ejs");

var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	flash = require("connect-flash"),
	methodOverride = require("method-override"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

// requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

// setting up db, view engines, directories

// Local mongo db connect.
// mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useNewUrlParser: true, useUnifiedTopology: true });
// Online mongo database link: mongodb+srv://dbJonas:<password>@cluster0.vyvev.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose
	.connect("mongodb+srv://dbJonas:scheiwiller0@cluster0.vyvev.mongodb.net/cluster0?retryWrites=true&w=majority", {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("Connected to DB!");
	})
	.catch((err) => {
		console.log("Error: ", err.message);
	});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // all mentioned files in this code will have .ejs extension
app.use(express.static(__dirname + "/public")); // setting to use public folder
app.use(methodOverride("_method")); // rekomenduoja docsuose nurodyt _method
app.use(flash()); // flash messages
// seedDB();

// nurodo kad kiekvienam route, perduoti į ejs kintamąjį currentUser kuris turi req.user duomenis.

// Passport configuration
app.use(
	require("express-session")({
		secret: "Once again Rusty wins cutest dog.",
		resave: false,
		saveUninitialized: false
	})
);

// setting up authentication libraries.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");

	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP);

// app.listen(3000, function() {
// 	console.log("YelpCamp server has started.");
// });