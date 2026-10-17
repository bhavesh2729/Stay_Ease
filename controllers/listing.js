
const Listing = require("../models/listing");
const Review = require("../models/review");

// ================= HOME - ALL LISTINGS =================
module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});

    res.render("alllisting.ejs", { allListings });
  } catch (err) {
    next(err);
  }
};

// ================= NEW LISTING FORM =================
module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};

// ================= SHOW ONE LISTING =================
module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find listing
    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    // Find reviews belonging to this listing
    const reviews = await Review.find({ listing: id })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    // Send listing and reviews to show.ejs
    res.render("show.ejs", {
      listing,
      reviews
    });

  } catch (err) {
    next(err);
  }
};

// ================= CREATE LISTING =================
module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);

    // Logged-in user becomes the owner
    newListing.owner = req.session.userId;

    await newListing.save();

    res.redirect("/listing");
  } catch (err) {
    next(err);
  }
};

// ================= EDIT LISTING FORM =================
module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    res.render("edit.ejs", { listing });
  } catch (err) {
    next(err);
  }
};

// ================= UPDATE LISTING =================
module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true, new: true }
    );

    if (!updatedListing) {
      return res.status(404).send("Listing not found");
    }

    res.redirect(`/listing/${updatedListing._id}`);
  } catch (err) {
    next(err);
  }
};

// ================= DELETE LISTING =================
module.exports.deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }

    // Delete reviews associated with the deleted listing
    await Review.deleteMany({ listing: id });

    res.redirect("/listing");
  } catch (err) {
    next(err);
  }
};
