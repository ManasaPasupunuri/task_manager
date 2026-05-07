import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // password strength
  const str = (() => {
    const p = form.password;
    if (!p) return null;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 1) return { w: '25%', label: 'Weak', color: '#ef4444' };
    if (s === 2) return { w: '50%', label: 'Fair', color: '#f59e0b' };
    if (s === 3) return { w: '75%', label: 'Good', color: '#3b82f6' };
    return { w: '100%', label: 'Strong', color: '#10b981' };
  })();

  return (
    <div className="min-h-screen auth-bg flex">
      {/* Left branding */}
      <div className="hidden lg:flex flex-col justify-between" style={{ width: '45%', padding: '56px 56px 40px' }}>
        <h1 className="gradient-text" style={{ fontSize: 18, fontWeight: 700 }}>✦ TaskForge</h1>

        <div style={{ maxWidth: 380 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, color: '#f0f1f5', marginBottom: 16 }}>
            Start building <span className="gradient-text">something great.</span>
          </h2>
          <p style={{ fontSize: 15, color: '#8b90a7', lineHeight: 1.7 }}>
            Join your team and take control of projects, tasks, and deadlines.
          </p>
          <div className="grid grid-cols-3" style={{ gap: 12, marginTop: 36 }}>
            {[{ v: '∞', l: 'Projects' }, { v: '∞', l: 'Members' }, { v: '100%', l: 'Free' }].map((s) => (
              <div key={s.l} className="card" style={{ textAlign: 'center', padding: '16px 8px' }}>
                <p className="gradient-text" style={{ fontSize: 20, fontWeight: 700 }}>{s.v}</p>
                <p style={{ fontSize: 11, color: '#6b7190', marginTop: 4 }}>{s.l}</p>
              </div>
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
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f0f1f5', marginBottom: 4 }}>Create your account</h2>
            <p style={{ fontSize: 13, color: '#6b7190', marginBottom: 28 }}>Get started in less than a minute</p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-box" style={{ marginBottom: 20 }}>
                  <svg style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Full name</label>
                <input type="text" className="input-field" placeholder="Jane Doe"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Email</label>
                <input type="email" className="input-field" placeholder="you@company.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Password</label>
                <input type="password" className="input-field" placeholder="Min 8 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                {str && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ height: 3, background: '#1e2340', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: str.w, background: str.color, borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                    <p style={{ fontSize: 11, color: str.color, marginTop: 6 }}>{str.label}</p>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#b0b4c4', marginBottom: 8 }}>Confirm password</label>
                <input type="password" className="input-field" placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p style={{ fontSize: 12, color: '#f87171', marginTop: 8 }}>Passwords don't match</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating...</> : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7190', marginTop: 28 }}>
              Already have an account? <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
