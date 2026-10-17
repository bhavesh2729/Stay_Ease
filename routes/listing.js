
const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listing");

const {
  isLoggedIn,
  isOwner
} = require("../middleware");

// ================= NEW LISTING =================
// Login required
router.get(
  "/new",
  isLoggedIn,
  listingController.renderNewForm
);

// ================= ALL LISTINGS =================
// Anyone can view all listings
router.get("/", listingController.index);

// ================= CREATE LISTING =================
// Login required
router.post(
  "/",
  isLoggedIn,
  listingController.createListing
);

// ================= EDIT LISTING =================
// Only owner can open edit page
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  listingController.renderEditForm
);

// ================= UPDATE LISTING =================
// Only owner can update
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  listingController.updateListing
);

// ================= DELETE LISTING =================
// Only owner can delete
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  listingController.deleteListing
);

// ================= SHOW LISTING =================
// Anyone can view a single listing
router.get(
  "/:id",
  listingController.showListing
);

module.exports = router;
