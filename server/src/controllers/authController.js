const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'NEXUS_SUPER_SECRET_CORE_TOKEN_KEY_99';

// 1. Process New Developer Signup
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Name, email, and password tokens are strictly mandatory.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Conflict Error', message: 'Network identity node email already registered.' });
    }

    const newUser = await User.create({ name, email, password });
    
    // Automatically issue a token right after sign up for seamless onboarding
    const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    next(error); // Route safely through our global error handler middleware
  }
};

// 2. Process Existing User Login Verification
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email and passcode strings are mandatory.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Clearance Rejected', message: 'Invalid credentials or security clearance.' });
    }

    // Verify plain text password input against the encrypted hash string inside PostgreSQL
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Clearance Rejected', message: 'Invalid credentials or security clearance.' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};
