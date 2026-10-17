
const Service = require("../models/service");

// GET /services - Show all services
module.exports.index = async (req, res) => {
  try {
    const allServices = await Service.find({}).sort({ createdAt: -1 });

    console.log("Total services:", allServices.length);

    res.render("services/index.ejs", { allServices });
  } catch (err) {
    console.error("LOAD SERVICES ERROR:", err);
    res.status(500).send("Services load करताना error आला.");
  }
};

// GET /services/new - Show create form
module.exports.renderNewForm = (req, res) => {
  res.render("services/new.ejs");
};

// POST /services - Create service
module.exports.createService = async (req, res) => {
  try {
    if (!req.body.service) {
      return res.status(400).send("Form data missing.");
    }

    const newService = new Service(req.body.service);
    await newService.save();

    console.log("Service created:", newService._id);

    res.redirect("/services");
  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    res.status(400).send(err.message);
  }
};

// GET /services/:id - Show one service
module.exports.showService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).send("Service सापडली नाही.");
    }

    res.render("services/show.ejs", { service });
  } catch (err) {
    console.error("SHOW SERVICE ERROR:", err);
    res.status(400).send("Invalid service ID.");
  }
};

// GET /services/:id/edit - Show edit form
module.exports.renderEditForm = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).send("Service सापडली नाही.");
    }

    res.render("services/edit.ejs", { service });
  } catch (err) {
    console.error("EDIT FORM ERROR:", err);
    res.status(400).send("Invalid service ID.");
  }
};

// PUT /services/:id - Update service
module.exports.updateService = async (req, res) => {
  try {
    if (!req.body.service) {
      return res.status(400).send("Form data missing.");
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body.service },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).send("Service सापडली नाही.");
    }

    res.redirect(`/services/${updatedService._id}`);
  } catch (err) {
    console.error("UPDATE SERVICE ERROR:", err);
    res.status(400).send(err.message);
  }
};

// DELETE /services/:id - Delete service
module.exports.deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).send("Service .");
    }

    res.redirect("/services");
  } catch (err) {
    console.error("DELETE SERVICE ERROR:", err);
    res.status(400).send("Service delete .");
  }
};
