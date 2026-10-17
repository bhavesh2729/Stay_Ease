const Experience = require("../models/experience");

// All Experiences
module.exports.index = async (req, res) => {
  const allExperiences = await Experience.find({});

  res.render("experiences/index.ejs", {
    allExperiences
  });
};

// New Experience Form
module.exports.renderNewForm = (req, res) => {
  res.render("experiences/new.ejs");
};

// Create Experience
module.exports.createExperience = async (req, res) => {
  try {
    const newExperience = new Experience(
      req.body.experience
    );

    await newExperience.save();

    res.redirect("/experiences");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error creating experience");
  }
};

// Show One Experience
module.exports.showExperience = async (req, res) => {
  const { id } = req.params;

  const experience = await Experience.findById(id);

  if (!experience) {
    return res.status(404).send("Experience not found");
  }

  res.render("experiences/show.ejs", {
    experience
  });
};