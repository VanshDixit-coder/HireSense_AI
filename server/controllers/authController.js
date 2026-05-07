const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function normalizeSkills(skills = []) {
  if (Array.isArray(skills)) {
    return [...new Set(skills.map((skill) => String(skill).trim()).filter(Boolean))];
  }
  return String(skills)
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.statusCode = 400;
      throw error;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = signToken(user._id);
    res.status(201).json({ success: true, data: { token, user: user.toSafeObject() } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = signToken(user._id);
    res.json({ success: true, data: { token, user: user.toSafeObject() } });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    res.json({ success: true, data: { user: req.user } });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    if (req.body.profileSummary !== undefined) updates.profileSummary = String(req.body.profileSummary).trim();
    if (req.body.skills !== undefined) updates.skills = normalizeSkills(req.body.skills);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, updateProfile };
