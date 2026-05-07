// ──────────────────────────────────────────────
// Tasks Controller
// ──────────────────────────────────────────────

const tasksService = require('../services/tasks');

async function listTasks(req, res, next) {
  try {
    const tasks = await tasksService.listTasks(req.params.projectId, req.query);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await tasksService.createTask({
      ...req.body,
      projectId: req.params.projectId,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await tasksService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await tasksService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    await tasksService.deleteTask(req.params.id);
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTasks, createTask, getTask, updateTask, deleteTask };
