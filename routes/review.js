
const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createReview,
  deleteReview,
} = require("../controllers/reviews");

const { isLoggedIn } = require("../middleware");

// Add Review
router.post("/", isLoggedIn, createReview);

// Delete Review
router.delete("/:reviewId", isLoggedIn, deleteReview);

module.exports = router;
