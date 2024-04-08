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
    res.json({ token, userId: user._id });
  });
});

module.exports = router;
