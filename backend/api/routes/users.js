const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    res.status(500).send({ message: "Error registering user", error });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user)
    return res.status(401).send({ message: "Invalid username or password" });

  user.comparePassword(password, function (err, isMatch) {
    if (!isMatch)
      return res.status(401).send({ message: "Invalid username or password" });

    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    // req.session.userId = user._id;

    res.json({ token, userId: user._id });
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Error logging out" });
    }
    res.send({ message: "Logout successful" });
  });
});
module.exports = router;
