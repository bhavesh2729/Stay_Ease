
const mongoose = require("mongoose");
const Experience = require("../models/experience");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

const sampleExperiences = [
  {
    title: "Mumbai City Walking Tour",
    description: "Explore Gateway of India, Marine Drive and the famous streets of Mumbai with a local guide.",
    location: "Mumbai, Maharashtra",
    price: 1500,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
    category: "City Tour",
    duration: "3 hours"
  },
  {
    title: "Jaipur Heritage Tour",
    description: "Discover Jaipur's royal palaces, historic forts and colorful local markets.",
    location: "Jaipur, Rajasthan",
    price: 1800,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
    category: "City Tour",
    duration: "4 hours"
  },
  {
    title: "Delhi Old City Walk",
    description: "Walk through historic lanes, admire old architecture and discover the stories of Old Delhi.",
    location: "Delhi, India",
    price: 1200,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    category: "City Tour",
    duration: "3 hours"
  },
  {
    title: "Pune Heritage Discovery",
    description: "Visit famous heritage landmarks and learn about the history and culture of Pune.",
    location: "Pune, Maharashtra",
    price: 900,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
    category: "City Tour",
    duration: "2 hours"
  },
  {
    title: "Bengaluru Local City Tour",
    description: "Explore beautiful city landmarks, gardens and popular local neighborhoods.",
    location: "Bengaluru, Karnataka",
    price: 1100,
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    category: "City Tour",
    duration: "3 hours"
  },
  {
    title: "Traditional Indian Cooking",
    description: "Learn to prepare traditional Indian dishes and understand the use of authentic spices.",
    location: "Pune, Maharashtra",
    price: 999,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    category: "Cooking",
    duration: "2 hours"
  },
  {
    title: "Indian Street Food Experience",
    description: "Discover popular street food, local flavors and the stories behind regional dishes.",
    location: "Delhi, India",
    price: 1100,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    category: "Cooking",
    duration: "2 hours"
  },
  {
    title: "Homemade Pasta Workshop",
    description: "Learn how to prepare fresh pasta and enjoy a delicious meal you make yourself.",
    location: "Goa, India",
    price: 1400,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    category: "Cooking",
    duration: "2 hours"
  },
  {
    title: "Indian Dessert Making",
    description: "Discover traditional dessert-making techniques and prepare sweet treats from scratch.",
    location: "Nagpur, Maharashtra",
    price: 850,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307",
    category: "Cooking",
    duration: "90 minutes"
  },
  {
    title: "Fresh Bread Baking Class",
    description: "Learn basic baking techniques and prepare fresh bread in a friendly workshop.",
    location: "Mumbai, Maharashtra",
    price: 1300,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    category: "Cooking",
    duration: "3 hours"
  },
  {
    title: "Mountain Trekking Adventure",
    description: "Explore scenic trails, green valleys and breathtaking mountain viewpoints.",
    location: "Lonavala, Maharashtra",
    price: 1800,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    category: "Adventure",
    duration: "5 hours"
  },
  {
    title: "River Rafting Adventure",
    description: "Enjoy an exciting guided river rafting trip with proper safety equipment and instruction.",
    location: "Rishikesh, Uttarakhand",
    price: 2200,
    image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed",
    category: "Adventure",
    duration: "3 hours"
  },
  {
    title: "Lake Kayaking Experience",
    description: "Paddle across calm waters and enjoy scenic views during a guided kayaking session.",
    location: "Udaipur, Rajasthan",
    price: 1600,
    image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7",
    category: "Adventure",
    duration: "90 minutes"
  },
  {
    title: "Desert Camel Safari",
    description: "Experience desert landscapes, traditional hospitality and a memorable guided camel safari.",
    location: "Jaisalmer, Rajasthan",
    price: 2000,
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
    category: "Adventure",
    duration: "3 hours"
  },
  {
    title: "Coastal Scuba Diving",
    description: "Discover colorful underwater scenery with a guided introductory diving experience.",
    location: "Goa, India",
    price: 3500,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    category: "Adventure",
    duration: "3 hours"
  },
  {
    title: "Street Photography Walk",
    description: "Practice photography techniques while capturing architecture and everyday street life.",
    location: "Jaipur, Rajasthan",
    price: 1200,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d",
    category: "Photography",
    duration: "2 hours"
  },
  {
    title: "Golden Hour Portraits",
    description: "Learn portrait photography and capture beautiful natural-light photographs outdoors.",
    location: "Mumbai, Maharashtra",
    price: 1500,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    category: "Photography",
    duration: "90 minutes"
  },
  {
    title: "Nature Photography Trip",
    description: "Practice landscape photography while exploring beautiful natural surroundings.",
    location: "Matheran, Maharashtra",
    price: 1300,
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    category: "Photography",
    duration: "3 hours"
  },
  {
    title: "Food Photography Workshop",
    description: "Learn composition, lighting and styling techniques for attractive food photographs.",
    location: "Pune, Maharashtra",
    price: 1000,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    category: "Photography",
    duration: "2 hours"
  },
  {
    title: "Travel Photography Basics",
    description: "Learn practical camera and mobile photography techniques for your next trip.",
    location: "Goa, India",
    price: 950,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    category: "Photography",
    duration: "2 hours"
  },
  {
    title: "Indian Cultural Heritage",
    description: "Discover local traditions, historic architecture and the stories behind Indian heritage.",
    location: "Jaipur, Rajasthan",
    price: 1000,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
    category: "Culture",
    duration: "3 hours"
  },
  {
    title: "Traditional Pottery Workshop",
    description: "Learn basic pottery techniques and create your own handmade clay artwork.",
    location: "Bengaluru, Karnataka",
    price: 1300,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261",
    category: "Culture",
    duration: "2 hours"
  },
  {
    title: "Indian Folk Art Session",
    description: "Explore traditional Indian art styles and create a colorful piece of artwork.",
    location: "Jaipur, Rajasthan",
    price: 900,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    category: "Culture",
    duration: "2 hours"
  },
  {
    title: "Local Handicraft Discovery",
    description: "Meet local craft traditions and learn how handmade products are created.",
    location: "Udaipur, Rajasthan",
    price: 800,
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b",
    category: "Culture",
    duration: "90 minutes"
  },
  {
    title: "Historic Fort Exploration",
    description: "Explore a historic fort and learn about regional history, architecture and legends.",
    location: "Pune, Maharashtra",
    price: 1100,
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
    category: "Culture",
    duration: "3 hours"
  },
  {
    title: "Peaceful Forest Nature Walk",
    description: "Enjoy a guided walk through green forest trails and discover the beauty of nature.",
    location: "Matheran, Maharashtra",
    price: 800,
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b",
    category: "Nature",
    duration: "2 hours"
  },
  {
    title: "Waterfall Hiking Trip",
    description: "Walk through scenic trails and discover beautiful waterfalls and lush landscapes.",
    location: "Lonavala, Maharashtra",
    price: 1200,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9",
    category: "Nature",
    duration: "4 hours"
  },
  {
    title: "Sunrise Yoga Session",
    description: "Start your day with a guided yoga and meditation session in a peaceful outdoor setting.",
    location: "Rishikesh, Uttarakhand",
    price: 700,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    category: "Nature",
    duration: "1 hour"
  },
  {
    title: "Birdwatching Experience",
    description: "Discover local birdlife and learn basic birdwatching techniques with a nature guide.",
    location: "Bharatpur, Rajasthan",
    price: 1000,
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797",
    category: "Nature",
    duration: "2 hours"
  },
  {
    title: "Lakeside Camping Experience",
    description: "Spend time in nature, enjoy scenic lakeside views and experience a relaxing outdoor escape.",
    location: "Pawna Lake, Maharashtra",
    price: 2500,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
    category: "Nature",
    duration: "1 day"
  }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected!");

    const result = await Experience.insertMany(sampleExperiences);

    console.log(`${result.length} experiences added successfully!`);
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedDB();
