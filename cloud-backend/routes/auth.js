const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================
   🟢 REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      username,
      email,
      password: hashed,
      role: "user" // default
    });

    await user.save();

    res.json({ message: "User created ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Register failed" });
  }
});

/* =========================
   🔐 LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // check password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      "secret"
    );

    // send response
    res.json({
      token,
      userId: user._id,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
