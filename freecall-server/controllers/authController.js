const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

// In-memory fallback store when DB connection is not present
const inMemoryUsers = new Map();

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const newUser = new User({
        name,
        email,
        phone: phone || "+91 98765 43210",
        password: hashedPassword,
        minutes: 12,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, name: newUser.name },
        process.env.JWT_SECRET || "freecall_secret_key",
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          minutes: newUser.minutes,
          initials: newUser.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
        },
      });
    } else {
      // In-Memory Mode
      if (inMemoryUsers.has(email)) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const userObj = {
        id: `user_${Date.now()}`,
        name,
        email,
        phone: phone || "+91 98765 43210",
        password: hashedPassword,
        minutes: 12,
      };

      inMemoryUsers.set(email, userObj);

      const token = jwt.sign(
        { id: userObj.id, email: userObj.email, name: userObj.name },
        process.env.JWT_SECRET || "freecall_secret_key",
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        token,
        user: {
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          phone: userObj.phone,
          minutes: userObj.minutes,
          initials: userObj.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
        },
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    let user;
    if (isDbConnected) {
      user = await User.findOne({ email });
    } else {
      user = inMemoryUsers.get(email);
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id || user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "freecall_secret_key",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        minutes: user.minutes,
        initials: user.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    } else {
      const user = inMemoryUsers.get(req.user.email);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...userData } = user;
      return res.json(userData);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
