import api from './axios';

export const projectsApi = {
  list: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  // Members
  listMembers: (id) => api.get(`/projects/${id}/members`),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data),
  removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
  // Tasks (project-scoped)
  listTasks: (projectId, params) => api.get(`/projects/${projectId}/tasks`, { params }),
  createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
};
