const express = require("express");
const router = express.Router();

const experienceController = require("../controllers/experience");

router.get("/new", experienceController.renderNewForm);

router.get("/", experienceController.index);

router.post("/", experienceController.createExperience);

router.get("/:id", experienceController.showExperience);

module.exports = router;