
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

const app = express();
const port = process.env.PORT || 1452;

// ================= ROUTERS =================
const userRouter = require("./routes/user");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const experienceRouter = require("./routes/experience");
const serviceRouter = require("./routes/service");

// ================= MIDDLEWARE =================
const { isLoggedIn } = require("./middleware");

// Read form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// ================= EJS SETUP =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= METHOD OVERRIDE =================
app.use(methodOverride("_method"));

// ================= SESSION SETUP =================
app.use(
  session({
    name: "connect.sid",
    secret: process.env.SECRET || process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// ================= PREVENT PAGE CACHING =================
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// ================= CURRENT USER FOR EJS =================
app.use((req, res, next) => {
  res.locals.currUser = req.session.userId
    ? {
        _id: req.session.userId,
        username: req.session.username,
      }
    : null;

  next();
});

// ================= USER ROUTES =================
// Login, Register, Logout
app.use("/", userRouter);

// ================= PROFILE ROUTE =================
app.get("/profile", isLoggedIn, (req, res) => {
  res.render("users/profile.ejs", {
    currUser: {
      _id: req.session.userId,
      username: req.session.username,
    },
  });
});

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.redirect("/listing");
});

// ================= LISTING ROUTES =================
app.use("/listing", listingRouter);

// ================= REVIEW ROUTES =================
app.use("/listing/:id/reviews", reviewRouter);

// ================= EXPERIENCE ROUTES =================
app.use("/experiences", isLoggedIn, experienceRouter);

// ================= SERVICE ROUTES =================
app.use("/services", isLoggedIn, serviceRouter);

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).send("Page not found!");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("APPLICATION ERROR:", err);

  res.status(err.status || 500).send(
    err.status && err.status < 500
      ? err.message
      : "Something went wrong. Please try again."
  );
});

// ================= DATABASE + SERVER =================
async function main() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env file");
    }

    if (!process.env.SECRET && !process.env.SESSION_SECRET) {
      throw new Error("SECRET is missing in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Application startup error:", err.message);
    process.exit(1);
  }
}

main();
