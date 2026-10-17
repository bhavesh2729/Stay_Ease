
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

const app = express();
const port = process.env.PORT || 1452;

// ================= PRODUCTION PROXY =================
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ================= ROUTERS =================
const userRouter = require("./routes/user");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const experienceRouter = require("./routes/experience");
const serviceRouter = require("./routes/service");

// ================= MIDDLEWARE =================
const { isLoggedIn } = require("./middleware");

// ================= REQUEST BODY =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, "public")));

// ================= EJS SETUP =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= METHOD OVERRIDE =================
app.use(methodOverride("_method"));

// ================= SESSION SETUP =================
const sessionSecret =
  process.env.SECRET || process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error(
    "SECRET or SESSION_SECRET is missing in environment variables"
  );
}

app.use(
  session({
    name: "connect.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
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
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error("Application startup error:", err.message);
    process.exit(1);
  }
}

main();
