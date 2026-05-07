import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { tasksApi } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import PriorityBadge from '../components/PriorityBadge';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks');

  const [statusF, setStatusF] = useState('');
  const [assigneeF, setAssigneeF] = useState('');
  const [overdueF, setOverdueF] = useState(false);

  const [showAddMember, setShowAddMember] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [memberEmail, setMemberEmail] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [formErr, setFormErr] = useState('');
  const [formLoad, setFormLoad] = useState(false);

  const isAdmin = project?.myRole === 'ADMIN';

  const fetchProject = useCallback(async () => {
    try { const r = await projectsApi.getById(id); setProject(r.data); setProjectForm({ name: r.data.name, description: r.data.description || '' }); }
    catch (e) { if (e.response?.status === 403 || e.response?.status === 404) navigate('/projects'); }
  }, [id, navigate]);

  const fetchMembers = useCallback(async () => {
    try { setMembers((await projectsApi.listMembers(id)).data); } catch {}
  }, [id]);

  const fetchTasks = useCallback(async () => {
    const p = {};
    if (statusF) p.status = statusF;
    if (assigneeF) p.assigneeId = assigneeF;
    if (overdueF) p.overdue = 'true';
    try { setTasks((await projectsApi.listTasks(id, p)).data); } catch {}
  }, [id, statusF, assigneeF, overdueF]);

  useEffect(() => { Promise.all([fetchProject(), fetchMembers(), fetchTasks()]).finally(() => setLoading(false)); }, [fetchProject, fetchMembers, fetchTasks]);

  const handleAddMember = async (e) => {
    e.preventDefault(); setFormErr(''); setFormLoad(true);
    try { await projectsApi.addMember(id, { email: memberEmail }); setMemberEmail(''); setShowAddMember(false); fetchMembers(); }
    catch (e) { setFormErr(e.response?.data?.message || 'Failed.'); } finally { setFormLoad(false); }
  };

  const handleRemoveMember = async (uid) => {
    if (!confirm('Remove this member?')) return;
    try { await projectsApi.removeMember(id, uid); fetchMembers(); } catch (e) { alert(e.response?.data?.message || 'Failed.'); }
  };

  const openTaskForm = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', assigneeId: task.assigneeId || '' });
    } else {
      setEditingTask(null);
      setTaskForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
    }
    setFormErr(''); setShowTaskForm(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault(); setFormErr(''); setFormLoad(true);
    const payload = { ...taskForm, assigneeId: taskForm.assigneeId || null, dueDate: taskForm.dueDate || null };
    try {
      if (editingTask) await tasksApi.update(editingTask.id, payload);
      else await projectsApi.createTask(id, payload);
      setShowTaskForm(false); fetchTasks();
    } catch (e) { setFormErr(e.response?.data?.message || 'Failed.'); } finally { setFormLoad(false); }
  };

  const handleDeleteTask = async (tid) => { if (!confirm('Delete this task?')) return; try { await tasksApi.delete(tid); fetchTasks(); } catch {} };
  const handleQuickStatus = async (tid, s) => { try { await tasksApi.update(tid, { status: s }); fetchTasks(); } catch {} };

  const handleUpdateProject = async (e) => {
    e.preventDefault(); setFormErr(''); setFormLoad(true);
    try { await projectsApi.update(id, projectForm); setShowEditProject(false); fetchProject(); }
    catch (e) { setFormErr(e.response?.data?.message || 'Failed.'); } finally { setFormLoad(false); }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project permanently?')) return;
    try { await projectsApi.delete(id); navigate('/projects'); } catch (e) { alert(e.response?.data?.message || 'Failed.'); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
  const isOverdue = (d) => d && new Date(d) < new Date();

  if (loading) return <div className="flex items-center justify-center" style={{ height: 300 }}><div className="spinner" /></div>;
  if (!project) return null;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-start justify-between" style={{ marginBottom: 28 }}>
        <div>
          <button onClick={() => navigate('/projects')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7190', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: 8 }}>
            ← Projects
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f1f5' }}>{project.name}</h1>
          {project.description && <p style={{ fontSize: 13, color: '#6b7190', marginTop: 4, maxWidth: 480 }}>{project.description}</p>}
        </div>
        {isAdmin && (
          <div className="flex items-center" style={{ gap: 8 }}>
            <button onClick={() => setShowEditProject(true)} className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>Edit</button>
            <button onClick={handleDeleteProject} className="btn-danger">Delete</button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex" style={{ gap: 0, borderBottom: '1px solid #1e2340', marginBottom: 24 }}>
        {['tasks', 'members'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            background: 'none', border: 'none', fontFamily: 'var(--font-sans)',
            color: tab === t ? '#818cf8' : '#6b7190',
            borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent',
            marginBottom: -1,
          }}>
            {t === 'tasks' ? `Tasks (${tasks.length})` : `Members (${members.length})`}
          </button>
        ))}
      </div>

      {/* ─── Tasks Tab ─────────────────────────── */}
      {tab === 'tasks' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center" style={{ gap: 10, marginBottom: 20 }}>
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="input-field" style={{ width: 'auto', fontSize: 13 }}>
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <select value={assigneeF} onChange={(e) => setAssigneeF(e.target.value)} className="input-field" style={{ width: 'auto', fontSize: 13 }}>
              <option value="">All Assignees</option>
              {members.map((m) => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8b90a7', cursor: 'pointer' }}>
              <input type="checkbox" checked={overdueF} onChange={(e) => setOverdueF(e.target.checked)} style={{ accentColor: '#6366f1' }} /> Overdue
            </label>
            <div style={{ flex: 1 }} />
            <button onClick={() => openTaskForm()} className="btn-primary" style={{ fontSize: 12 }}>+ New Task</button>
          </div>

          {/* Task Table */}
          {tasks.length > 0 ? (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2340' }}>
                    {['Title', 'Status', 'Priority', 'Due', 'Assignee', ''].map((h, i) => (
                      <th key={h||i} style={{ textAlign: i === 5 ? 'right' : 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#555b78', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #14182e' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d6e0' }}>{t.title}</p>
                        {t.description && <p style={{ fontSize: 11, color: '#555b78', marginTop: 2, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select value={t.status} onChange={(e) => handleQuickStatus(t.id, e.target.value)}
                          style={{ background: '#0e1225', border: '1px solid #1e2340', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: '#b0b4c4', cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-sans)' }}>
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px' }}><PriorityBadge priority={t.priority} /></td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 13, color: t.status !== 'DONE' && isOverdue(t.dueDate) ? '#f87171' : '#8b90a7', fontWeight: t.status !== 'DONE' && isOverdue(t.dueDate) ? 600 : 400 }}>
                          {fmtDate(t.dueDate)}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {t.assignee ? (
                          <div className="flex items-center" style={{ gap: 8 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 6, background: '#181c3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#818cf8' }}>
                              {t.assignee.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: 12, color: '#b0b4c4' }}>{t.assignee.name}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#3f4562', fontStyle: 'italic' }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div className="flex items-center justify-end" style={{ gap: 4 }}>
                          <button onClick={() => openTaskForm(t)} style={{ fontSize: 11, color: '#8b90a7', padding: '4px 10px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>Edit</button>
                          {isAdmin && <button onClick={() => handleDeleteTask(t.id)} style={{ fontSize: 11, color: '#6b4040', padding: '4px 10px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>Delete</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card" style={{ padding: '56px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#d4d6e0', marginBottom: 4 }}>No tasks found</p>
              <p style={{ fontSize: 13, color: '#6b7190', marginBottom: 20 }}>
                {statusF || assigneeF || overdueF ? 'Try adjusting your filters' : 'Create your first task'}
              </p>
              {!statusF && !assigneeF && !overdueF && <button onClick={() => openTaskForm()} className="btn-primary" style={{ fontSize: 12 }}>Create task</button>}
            </div>
          )}
        </div>
      )}

      {/* ─── Members Tab ───────────────────────── */}
      {tab === 'members' && (
        <div>
          {isAdmin && (
            <div style={{ marginBottom: 20 }}>
              <button onClick={() => setShowAddMember(true)} className="btn-primary" style={{ fontSize: 12 }}>+ Add Member</button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {members.map((m) => (
              <div key={m.id} className="card flex items-center justify-between" style={{ padding: '14px 20px' }}>
                <div className="flex items-center" style={{ gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                    {m.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#d4d6e0' }}>{m.user.name}</p>
                    <p style={{ fontSize: 11, color: '#555b78', marginTop: 1 }}>{m.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                    background: m.role === 'ADMIN' ? '#181c3a' : '#1a2235',
                    color: m.role === 'ADMIN' ? '#818cf8' : '#8b90a7',
                  }}>{m.role}</span>
                  {isAdmin && m.userId !== user?.id && <button onClick={() => handleRemoveMember(m.userId)} className="btn-danger" style={{ fontSize: 11, padding: '4px 10px' }}>Remove</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Modals ────────────────────────────── */}
      <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)} title="Add Member">
        <form onSubmit={handleAddMember}>
          {formErr && <div className="error-box" style={{ marginBottom: 20 }}>{formErr}</div>}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Email address</label>
            <input type="email" className="input-field" placeholder="user@example.com" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required />
            <p style={{ fontSize: 11, color: '#555b78', marginTop: 8 }}>The user must already have a TaskForge account.</p>
          </div>
          <div className="flex justify-end" style={{ gap: 10 }}>
            <button type="button" onClick={() => setShowAddMember(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formLoad} className="btn-primary">{formLoad ? 'Adding...' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showTaskForm} onClose={() => setShowTaskForm(false)} title={editingTask ? 'Edit Task' : 'Create Task'}>
        <form onSubmit={handleTaskSubmit}>
          {formErr && <div className="error-box" style={{ marginBottom: 20 }}>{formErr}</div>}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Title</label>
            <input className="input-field" placeholder="What needs to be done?" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Description</label>
            <textarea className="input-field" placeholder="Add details (optional)" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} style={{ minHeight: 72, resize: 'none' }} />
          </div>

          <div className="grid grid-cols-2" style={{ gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Status</label>
              <select className="input-field" value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                <option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Priority</label>
              <select className="input-field" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: 14, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Due Date</label>
              <input type="date" className="input-field" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Assignee</label>
              <select className="input-field" value={taskForm.assigneeId} onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}>
                <option value="">Unassigned</option>
                {members.map((m) => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end" style={{ gap: 10 }}>
            <button type="button" onClick={() => setShowTaskForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formLoad} className="btn-primary">{formLoad ? 'Saving...' : editingTask ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showEditProject} onClose={() => setShowEditProject(false)} title="Edit Project">
        <form onSubmit={handleUpdateProject}>
          {formErr && <div className="error-box" style={{ marginBottom: 20 }}>{formErr}</div>}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Project Name</label>
            <input className="input-field" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Description</label>
            <textarea className="input-field" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} style={{ minHeight: 80, resize: 'none' }} />
          </div>
          <div className="flex justify-end" style={{ gap: 10 }}>
            <button type="button" onClick={() => setShowEditProject(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formLoad} className="btn-primary">{formLoad ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
