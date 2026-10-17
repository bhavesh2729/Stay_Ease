
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    priceType: {
      type: String,
      enum: ["Per guest", "Per group"],
      default: "Per guest",
    },

    image: {
      type: String,
      default: "",
    },

    hostName: {
      type: String,
      default: "Host",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
