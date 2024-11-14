const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(400).json({ message: "User registration failed", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: "Login failed", error });
  }
};
