
require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");
const { data } = require("./data");

async function initDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");

    // Find an existing registered user
    const user = await User.findOne({});

    if (!user) {
      console.log(
        "No registered user found. Please register/login first, then run this file again."
      );
      return;
    }

    // Add the real user's ID as owner
    const listingsWithOwner = data.map((listing) => ({
      ...listing,
      owner: user._id,
    }));

  

    await Listing.insertMany(listingsWithOwner);

    console.log(`${listingsWithOwner.length} listings inserted successfully`);
    console.log("Owner:", user.username || user._id);
  } catch (error) {
    console.error("Initialization error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

initDB();
