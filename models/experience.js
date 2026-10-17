const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      default: "Other"
    },

    duration: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Experience",
  experienceSchema
);