
const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/service");

router.get("/", serviceController.index);

router.get("/new", serviceController.renderNewForm);

router.post("/", serviceController.createService);

router.get("/:id/edit", serviceController.renderEditForm);

router.get("/:id", serviceController.showService);

router.put("/:id", serviceController.updateService);

router.delete("/:id", serviceController.deleteService);

module.exports = router;
