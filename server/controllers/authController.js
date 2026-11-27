import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const cookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/'
});

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

function issueCookie(res, user) {
  const token = jwt.sign({}, process.env.JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: '7d'
  });
  res.cookie('token', token, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body ?? {};
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof confirmPassword !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !password ||
    !confirmPassword
  ) {
    return res.status(400).json({ message: 'Please complete every field.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (name.trim().length > 80) {
    return res.status(400).json({ message: 'Name must be 80 characters or fewer.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
  res.status(201).json({ message: 'Account created successfully. You can now log in.' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ message: 'Please enter your email and password.' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }

  issueCookie(res, user);
  res.json({ user: publicUser(user) });
});

export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'You have been logged out.' });
};

export const me = (req, res) => {
  res.json({ user: publicUser(req.user) });
};
