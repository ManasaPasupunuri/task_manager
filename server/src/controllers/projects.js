// ──────────────────────────────────────────────
// Projects Controller
// ──────────────────────────────────────────────

const projectsService = require('../services/projects');

async function listProjects(req, res, next) {
  try {
    const projects = await projectsService.listUserProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const project = await projectsService.createProject({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await projectsService.getProjectById(req.params.id);
    // Attach user's project role
    project.myRole = req.projectMembership?.role || null;
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const project = await projectsService.updateProject(req.params.id, req.body);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    await projectsService.deleteProject(req.params.id);
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProjects, createProject, getProject, updateProject, deleteProject };
