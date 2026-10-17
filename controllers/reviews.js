
const Listing = require("../models/listing");
const Review = require("../models/review");

// ================= CREATE REVIEW =================
module.exports.createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Check login
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    // Validate rating
    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).send("Rating must be between 1 and 5.");
    }

    // Validate comment
    if (
      typeof comment !== "string" ||
      comment.trim().length < 3 ||
      comment.trim().length > 1000
    ) {
      return res.status(400).send(
        "Comment must contain 3 to 1000 characters."
      );
    }

    // Find listing
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found.");
    }

    // Create review
    const review = new Review({
      rating: numericRating,
      comment: comment.trim(),
      author: req.session.userId,
      listing: listing._id,
    });

    await review.save();

    res.redirect(`/listing/${id}#reviews`);
  } catch (err) {
    next(err);
  }
};

// ================= DELETE REVIEW =================
module.exports.deleteReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    if (!req.session.userId) {
      return res.redirect("/login");
    }

    // Find review belonging to this listing
    const review = await Review.findOne({
      _id: reviewId,
      listing: id,
    });

    if (!review) {
      return res.status(404).send("Review not found.");
    }

    // Only the review author can delete it
    if (String(review.author) !== String(req.session.userId)) {
      return res.status(403).send(
        "You are not allowed to delete this review."
      );
    }

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}#reviews`);
  } catch (err) {
    next(err);
  }
};
