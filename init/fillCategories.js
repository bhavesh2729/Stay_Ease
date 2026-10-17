
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const existingData = require("./data");

const destinations = [
  ["New York City", "United States"],
  ["Aspen", "United States"],
  ["Florence", "Italy"],
  ["Portland", "United States"],
  ["Cancun", "Mexico"],
  ["Lake Tahoe", "United States"],
  ["Los Angeles", "United States"],
  ["Verbier", "Switzerland"],
  ["Serengeti National Park", "Tanzania"],
  ["Amsterdam", "Netherlands"],
  ["Fiji", "Fiji"],
  ["Cotswolds", "United Kingdom"],
  ["Boston", "United States"],
  ["Bali", "Indonesia"],
  ["Banff", "Canada"],
  ["Miami", "United States"],
  ["Phuket", "Thailand"],
  ["Scottish Highlands", "United Kingdom"],
  ["Dubai", "United Arab Emirates"],
  ["Montana", "United States"],
  ["Mykonos", "Greece"],
  ["Costa Rica", "Costa Rica"],
  ["Charleston", "United States"],
  ["Tokyo", "Japan"],
  ["New Hampshire", "United States"],
  ["Maldives", "Maldives"],
  ["nagpur", "India"],
];

const templates = [
  {
    title: "Cozy Comfort Home",
    description: "Relax in a cozy home with comfortable interiors and beautiful surroundings.",
    price: 1200,
    image: "photo-1611892440504-42a792e24d32",
  },
  {
    title: "Luxury Holiday Stay",
    description: "Enjoy a stylish holiday home with modern amenities and a welcoming atmosphere.",
    price: 2200,
    image: "photo-1600210492486-724fe5c67fb0",
  },
  {
    title: "Peaceful Retreat",
    description: "Unwind in a peaceful retreat and discover the highlights of your destination.",
    price: 1800,
    image: "photo-1449158743715-0a90ebb6d2d8",
  },
  {
    title: "Modern Traveller Apartment",
    description: "A modern apartment offering a comfortable base for your next adventure.",
    price: 2500,
    image: "photo-1522708323590-d24dbb6b0267",
  },
  {
    title: "Beautiful Escape Villa",
    description: "Make memorable travel moments in this beautiful and relaxing holiday home.",
    price: 2000,
    image: "photo-1499793983690-e29da59ef1c2",
  },
];

async function fillCategories() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
    console.log("MongoDB connected!");

    // Include the locations already present in your original seed data.
    const allDestinations = [
      ...destinations,
      ...existingData.data.map((item) => [
        item.location,
        item.country,
      ]),
    ];

    const uniqueDestinations = [
      ...new Map(
        allDestinations.map(([location, country]) => [
          `${location.toLowerCase()}|${country.toLowerCase()}`,
          [location, country],
        ])
      ).values(),
    ];

    let totalAdded = 0;

    for (const [location, country] of uniqueDestinations) {
      let count = await Listing.countDocuments({ location, country });
      let templateIndex = 0;

      while (count < 5 && templateIndex < templates.length) {
        const template = templates[templateIndex];
        const title = `${template.title} in ${location}`;

        const exists = await Listing.findOne({
          title,
          location,
          country,
        });

        if (!exists) {
          await Listing.create({
            title,
            description: `${template.description} Explore ${location} and enjoy your stay.`,
            image: {
              filename: template.title.toLowerCase().replaceAll(" ", "-"),
              url: `https://images.unsplash.com/${template.image}?auto=format&fit=crop&w=1000&q=80`,
            },
            price: template.price,
            location,
            country,
          });

          totalAdded++;
          count++;
          console.log(`Added listing for ${location}: ${title}`);
        }

        templateIndex++;
      }

      console.log(`${location}: ${count} listings`);
    }

    console.log(`Completed. ${totalAdded} listings added.`);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

fillCategories();
