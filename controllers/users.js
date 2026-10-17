
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Show Register Page
module.exports.renderRegister = (req, res) => {
  res.render("users/register.ejs", { error: null });
};

// Register User
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).render("users/register.ejs", {
        error: "Please fill in all fields."
      });
    }

    if (password.length < 8) {
      return res.status(400).render("users/register.ejs", {
        error: "Password must be at least 8 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).render("users/register.ejs", {
        error: "This email is already registered. Please login."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save new user
    const newUser = new User({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    await newUser.save();

    // Registration successful; open login page
    return res.redirect("/login?registered=1");

  } catch (err) {
    // MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(409).render("users/register.ejs", {
        error: "This email is already registered. Please login."
      });
    }

    console.error("REGISTER ERROR:", err);

    return res.status(500).render("users/register.ejs", {
      error: "Something went wrong. Please try again."
    });
  }
};

// Show Login Page
module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs", {
    error: null,
    success: req.query.registered
      ? "Registration successful! Please login."
      : null
  });
};

// Login User
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).render("users/login.ejs", {
        error: "Please enter email and password.",
        success: null
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).render("users/login.ejs", {
        error: "Invalid email or password.",
        success: null
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).render("users/login.ejs", {
        error: "Invalid email or password.",
        success: null
      });
    }

    // Prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error("SESSION ERROR:", err);
        return res.status(500).send("Please try again.");
      }

      req.session.userId = user._id.toString();
      req.session.username = user.username;

      // Save session before redirecting
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("SESSION SAVE ERROR:", saveErr);
          return res.status(500).send("Please try again.");
        }

        return res.redirect("/listing");
      });
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).render("users/login.ejs", {
      error: "Something went wrong. Please try again.",
      success: null
    });
  }
};

// Logout User
module.exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    // Clear session cookie
    res.clearCookie("connect.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    // Prevent cached pages after logout
    res.set("Cache-Control", "no-store");

    // Redirect to login page
    return res.redirect("/login");
  });
};
