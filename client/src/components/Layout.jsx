import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { to: '/projects', label: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
  { to: '/profile',  label: 'Profile',  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex" style={{ background: '#0b0e1c' }}>
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full flex flex-col"
        style={{ width: 240, background: '#0f1327', borderRight: '1px solid #1e2340' }}
      >
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px' }}>
          <h1 className="text-base font-bold gradient-text flex items-center gap-2">
            <span>✦</span> TaskForge
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3" style={{ paddingTop: 4 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#3f4562', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px', marginBottom: 8 }}>
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg transition-colors`
              }
              style={({ isActive }) => ({
                padding: '9px 12px',
                marginBottom: 2,
                fontSize: 13,
                fontWeight: 500,
                color: isActive ? '#818cf8' : '#8b90a7',
                background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
              })}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid #1e2340' }}>
          <div className="flex items-center gap-3" style={{ padding: '8px', borderRadius: 10, background: '#12162a', marginBottom: 8 }}>
            <div
              className="flex items-center justify-center text-white font-bold"
              style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: 13 }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#d4d6e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: '#555b78' }}>{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 transition-colors"
            style={{ padding: '8px 12px', borderRadius: 8, fontSize: 12, color: '#6b7190', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            onMouseEnter={(e) => { e.target.style.color = '#f87171'; }}
            onMouseLeave={(e) => { e.target.style.color = '#6b7190'; }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
