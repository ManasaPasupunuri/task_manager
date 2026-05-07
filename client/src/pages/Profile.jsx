import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

  const rows = [
    { label: 'Full Name',    value: user?.name },
    { label: 'Email',        value: user?.email },
    { label: 'Role',         value: user?.role, badge: true },
    { label: 'Member Since', value: fmtDate(user?.createdAt) },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f1f5', marginBottom: 28 }}>Profile</h1>

      <div className="card" style={{ padding: 32 }}>
        {/* Avatar header */}
        <div className="flex items-center" style={{ gap: 20, paddingBottom: 24, borderBottom: '1px solid #1e2340', marginBottom: 8 }}>
          <div
            className="flex items-center justify-center text-white font-bold"
            style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: 22 }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#f0f1f5' }}>{user?.name}</p>
            <p style={{ fontSize: 13, color: '#6b7190', marginTop: 2 }}>{user?.email}</p>
          </div>
        </div>

        {/* Info rows */}
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="flex items-center justify-between"
            style={{ padding: '18px 0', borderBottom: i < rows.length - 1 ? '1px solid #1e2340' : 'none' }}
          >
            <span style={{ fontSize: 13, color: '#6b7190' }}>{r.label}</span>
            {r.badge ? (
              <span style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: user?.role === 'ADMIN' ? '#181c3a' : '#1a2235',
                color: user?.role === 'ADMIN' ? '#818cf8' : '#8b90a7',
              }}>{r.value}</span>
            ) : (
              <span style={{ fontSize: 13, fontWeight: 500, color: '#d4d6e0' }}>{r.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
