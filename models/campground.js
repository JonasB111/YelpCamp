var mongoose = require("mongoose");

// Schema setup, educational purposes, neturėtų būt toks ilgas..
var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment" // tas "Comment" yra modelio pavadinimas
		}
	]
});

// Siunčiam schemą iš failo. Kituose failuose galėsim prijungt ir gauti tai.
module.exports = mongoose.model("Campground", campgroundSchema);
