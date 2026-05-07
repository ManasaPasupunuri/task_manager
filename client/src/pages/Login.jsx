import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-bg flex">
      {/* Left branding */}
      <div className="hidden lg:flex flex-col justify-between" style={{ width: '45%', padding: '56px 56px 40px' }}>
        <h1 className="gradient-text" style={{ fontSize: 18, fontWeight: 700 }}>✦ TaskForge</h1>

        <div style={{ maxWidth: 380 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, color: '#f0f1f5', marginBottom: 16 }}>
            Manage your team's work, <span className="gradient-text">effortlessly.</span>
          </h2>
          <p style={{ fontSize: 15, color: '#8b90a7', lineHeight: 1.7 }}>
            Organize projects, assign tasks, and track progress — with role-based access control built in.
          </p>
          <div className="flex flex-wrap gap-2" style={{ marginTop: 32 }}>
            {['Projects', 'Tasks', 'Teams', 'Roles', 'Dashboard'].map((f) => (
              <span key={f} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #1e2340', fontSize: 12, color: '#8b90a7', fontWeight: 500 }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#3f4562' }}>© 2026 TaskForge. Built for teams.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center" style={{ padding: '48px 24px' }}>
        <div className="w-full fade-in" style={{ maxWidth: 400 }}>
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 className="gradient-text" style={{ fontSize: 18, fontWeight: 700 }}>✦ TaskForge</h1>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f1f5', marginBottom: 4 }}>Welcome back</h2>
            <p style={{ fontSize: 13, color: '#6b7190', marginBottom: 28 }}>Sign in to your workspace</p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-box" style={{ marginBottom: 20 }}>
                  <svg style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Email</label>
                <input type="email" className="input-field" placeholder="you@company.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Password</label>
                <input type="password" className="input-field" placeholder="Enter your password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7190', marginTop: 28 }}>
              Don't have an account? <Link to="/signup" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
