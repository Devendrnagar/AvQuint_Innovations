const Task = require('../models/Task');

async function getTasks(req, res) {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
}

async function createTask(req, res) {
  const { title, description = '', status = 'pending' } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = await Task.create({
    title,
    description,
    status,
    user: req.user._id
  });

  res.status(201).json(task);
}

async function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = await Task.findOne({ _id: id, user: req.user._id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;

  await task.save();
  res.json(task);
}

async function deleteTask(req, res) {
  const { id } = req.params;

  const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted' });
}

async function toggleTaskStatus(req, res) {
  const { id } = req.params;

  const task = await Task.findOne({ _id: id, user: req.user._id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.status = task.status === 'completed' ? 'pending' : 'completed';
  await task.save();

  res.json(task);
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};
