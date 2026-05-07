import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import Modal from '../components/Modal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetch = () => {
    projectsApi.list().then((r) => setProjects(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setCreating(true);
    try { await projectsApi.create(form); setForm({ name: '', description: '' }); setShowCreate(false); fetch(); }
    catch (err) {
      const data = err.response?.data;
      // Show specific validation detail if available
      const msg = data?.details?.[0]?.message || data?.message || 'Failed to create project.';
      setError(msg);
    }
    finally { setCreating(false); }
  };

  if (loading) return <div className="flex items-center justify-center" style={{ height: 300 }}><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f1f5' }}>Projects</h1>
          <p style={{ fontSize: 13, color: '#6b7190', marginTop: 4 }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">+ New Project</button>
      </div>

      {/* Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: 16 }}>
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="card card-hover" style={{ display: 'block', padding: 24, textDecoration: 'none' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#181c3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: 18, height: 18, color: '#818cf8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                  background: p.myRole === 'ADMIN' ? '#181c3a' : '#1a2235',
                  color: p.myRole === 'ADMIN' ? '#818cf8' : '#8b90a7',
                }}>{p.myRole}</span>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f0f1f5', marginBottom: 4 }}>{p.name}</h3>
              {p.description && <p style={{ fontSize: 12, color: '#6b7190', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>}

              <div className="flex items-center" style={{ gap: 16, paddingTop: 14, borderTop: '1px solid #1e2340' }}>
                <span style={{ fontSize: 11, color: '#555b78' }}>👥 {p._count?.members || 0} members</span>
                <span style={{ fontSize: 11, color: '#555b78' }}>📋 {p._count?.tasks || 0} tasks</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#181c3a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg style={{ width: 24, height: 24, color: '#818cf8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#f0f1f5', marginBottom: 4 }}>No projects yet</p>
          <p style={{ fontSize: 13, color: '#6b7190', marginBottom: 20 }}>Create your first project to get started</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">Create project</button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Project">
        <form onSubmit={handleCreate}>
          {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Project Name</label>
            <input className="input-field" placeholder="e.g. Website Redesign" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Description</label>
            <textarea className="input-field" placeholder="What is this project about?" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: 90, resize: 'none' }} />
          </div>
          <div className="flex justify-end" style={{ gap: 10 }}>
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={creating} className="btn-primary">{creating ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
