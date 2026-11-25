import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function validTaskId(id) {
  return mongoose.isValidObjectId(id);
}

function parseTaskFields(input, { creating = false } = {}) {
  const body = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const fields = {};
  if (creating || Object.hasOwn(body, 'title')) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return { error: 'Task title is required.' };
    }
    if (body.title.trim().length > 160) {
      return { error: 'Task title must be 160 characters or fewer.' };
    }
    fields.title = body.title.trim();
  }

  if (creating || Object.hasOwn(body, 'description')) {
    if (body.description !== undefined && typeof body.description !== 'string') {
      return { error: 'Description must be text.' };
    }
    const description = (body.description ?? '').trim();
    if (description.length > 2000) {
      return { error: 'Description must be 2000 characters or fewer.' };
    }
    fields.description = description;
  }

  if (creating || Object.hasOwn(body, 'dueDate')) {
    const value = body.dueDate;
    if (value === '' || value === null || value === undefined) {
      fields.dueDate = null;
    } else {
      if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
        return { error: 'Please provide a valid due date.' };
      }
      fields.dueDate = new Date(value);
    }
  }
  return { fields };
}

export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const { fields, error } = parseTaskFields(req.body, { creating: true });
  if (error) return res.status(400).json({ message: error });

  const task = await Task.create({ ...fields, user: req.user._id });
  res.status(201).json({ task });
});

export const getTask = asyncHandler(async (req, res) => {
  if (!validTaskId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  if (!validTaskId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }
  const { fields, error } = parseTaskFields(req.body);
  if (error) return res.status(400).json({ message: error });
  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ message: 'Provide at least one task field to update.' });
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: fields },
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ task });
});

export const toggleTask = asyncHandler(async (req, res) => {
  if (!validTaskId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  task.completed = !task.completed;
  await task.save();
  res.json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  if (!validTaskId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task deleted successfully.' });
});
