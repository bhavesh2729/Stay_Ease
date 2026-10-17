
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const newYorkListings = require("./newYorkData");

async function addNewYorkListings() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
        console.log("DB connected");

        // Prevent duplicate insertion if this script is run again
        const existingTitles = await Listing.find({
            title: { $in: newYorkListings.map(item => item.title) },
            location: "New York City",
            country: "United States"
        }).distinct("title");

        const listingsToAdd = newYorkListings.filter(
            item => !existingTitles.includes(item.title)
        );

        if (listingsToAdd.length === 0) {
            console.log("These New York listings already exist.");
            return;
        }

        const addedListings = await Listing.insertMany(listingsToAdd);

        console.log(`${addedListings.length} New York listings added successfully!`);
    } catch (err) {
        console.error("Error adding New York listings:", err);
    } finally {
        await mongoose.connection.close();
    }
}

addNewYorkListings();
