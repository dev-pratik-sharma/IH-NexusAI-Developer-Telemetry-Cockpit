const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'NEXUS_CORE_SECRET_KEY';

// Secure Developer Unit Registration / Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Identity credentials incomplete.' });
    }

    // Guard: Prevent double-allocating duplicated nodes
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Identity Collision', message: 'Email node already mapped to a different system administrator.' });
    }

    // Encrypt security password using heavy salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Compile secure cryptographic authorization token
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: "Developer account initialized cleanly.",
      token,
      user: { name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration Crash', message: error.message });
  }
};

// Developer Workspace Authorization / Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Incomplete authentication parameters.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Clearance Failure', message: 'Invalid credentials trace.' });
    }

    // Verify cryptographically hashed security matching lines
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Clearance Failure', message: 'Invalid credentials trace.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: "Clearance authorized. Mounting workspace parameters.",
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Authorization Crash', message: error.message });
  }
};

// ==========================================================
// 🌌 NEW CRUCIAL ADDITION: Active Session Identity Recovery Gate
// ==========================================================
exports.getMe = async (req, res) => {
  try {
    // Queries the database row safely using the req.userId set by your auth middleware gate
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User profile not discovered', message: 'Clear localStorage tokens and signup again.' });
    }

    // Sends the true database-stored identity properties back to your React application context
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'System Registry Exception', message: error.message });
  }
};
