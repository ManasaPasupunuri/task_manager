// ──────────────────────────────────────────────
// Members Controller
// ──────────────────────────────────────────────

const membersService = require('../services/members');

async function listMembers(req, res, next) {
  try {
    const members = await membersService.listMembers(req.params.id);
    res.json(members);
  } catch (err) {
    next(err);
  }
}

async function addMember(req, res, next) {
  try {
    const member = await membersService.addMember(
      req.params.id,
      req.body.email,
      req.body.role
    );
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
}

async function removeMember(req, res, next) {
  try {
    const result = await membersService.removeMember(req.params.id, req.params.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { listMembers, addMember, removeMember };
