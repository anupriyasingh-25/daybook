import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRequired = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Please log in to continue.' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }

  if (
    typeof payload !== 'object' ||
    typeof payload.sub !== 'string' ||
    !mongoose.isValidObjectId(payload.sub)
  ) {
    return res.status(401).json({ message: 'Invalid authentication session.' });
  }

  const user = await User.findById(payload.sub).select('_id name email');
  if (!user) {
    return res.status(401).json({ message: 'Your account could not be found. Please log in again.' });
  }

  req.user = user;
  next();
});
