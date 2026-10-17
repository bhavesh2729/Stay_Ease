
const Listing = require("./models/listing");

// ================= LOGIN CHECK =================
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    if (req.session) {
      req.session.returnTo = req.originalUrl;
    }

    return res.redirect("/login");
  }

  next();
};

// ================= LISTING OWNER CHECK =================
module.exports.isOwner = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    // Check whether listing exists
    if (!listing) {
      return res.status(404).send("Listing not found!");
    }

    // Check whether owner exists
    if (!listing.owner) {
      return res.status(403).send(
        "This listing does not have an assigned owner."
      );
    }

    // Check whether logged-in user owns this listing
    if (
      listing.owner.toString() !== String(req.session.userId)
    ) {
      return res.status(403).send(
        "You are not the owner of this listing!"
      );
    }

    // Save listing for use in the next controller
    req.listing = listing;

    next();
  } catch (err) {
    console.error("LISTING OWNER CHECK ERROR:", err);

    if (err.name === "CastError") {
      return res.status(400).send("Invalid listing ID");
    }

    next(err);
  }
};
