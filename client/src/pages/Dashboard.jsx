import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getOverview()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center" style={{ height: 300 }}><div className="spinner" /></div>;

  const stats = [
    { label: 'Total Tasks', value: data?.totalTasks || 0, color: '#818cf8', bg: '#181c3a' },
    { label: 'To Do',       value: data?.statusCounts?.TODO || 0, color: '#60a5fa', bg: '#141e33' },
    { label: 'In Progress', value: data?.statusCounts?.IN_PROGRESS || 0, color: '#fbbf24', bg: '#1f1c14' },
    { label: 'Completed',   value: data?.statusCounts?.DONE || 0, color: '#34d399', bg: '#121f1a' },
    { label: 'Overdue',     value: data?.overdueCount || 0, color: '#f87171', bg: '#1f1414' },
  ];

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f1f5' }}>
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p style={{ fontSize: 13, color: '#6b7190', marginTop: 4 }}>Here's an overview of your tasks and projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5" style={{ gap: 14, marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ padding: '20px 18px', background: s.bg }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: '#6b7190', marginTop: 8, fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 20 }}>
        {/* Upcoming Tasks */}
        <div className="card" style={{ padding: 24 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0f1f5' }}>Upcoming Tasks</h2>
            <span style={{ fontSize: 12, color: '#555b78' }}>{data?.upcomingTasks?.length || 0} tasks</span>
          </div>

          {data?.upcomingTasks?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.upcomingTasks.map((task) => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: '#0e1225' }}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d6e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</p>
                    <p style={{ fontSize: 11, color: '#555b78', marginTop: 2 }}>{task.project?.name} · {fmtDate(task.dueDate)}</p>
                  </div>
                  <div className="flex items-center" style={{ gap: 6 }}>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 13, color: '#555b78' }}>No upcoming tasks</p>
              <p style={{ fontSize: 12, color: '#3f4562', marginTop: 4 }}>You're all caught up! 🎉</p>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="card" style={{ padding: 24 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0f1f5' }}>Recent Projects</h2>
            <Link to="/projects" style={{ fontSize: 12, color: '#818cf8', fontWeight: 500, textDecoration: 'none' }}>View all →</Link>
          </div>

          {data?.recentProjects?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.recentProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`}
                  style={{ display: 'block', padding: '10px 12px', borderRadius: 8, background: '#0e1225', textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#141832'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#0e1225'}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d6e0' }}>{project.name}</p>
                  <div className="flex items-center" style={{ gap: 16, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: '#555b78' }}>👥 {project._count?.members || 0}</span>
                    <span style={{ fontSize: 11, color: '#555b78' }}>📋 {project._count?.tasks || 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 13, color: '#555b78' }}>No projects yet</p>
              <Link to="/projects" className="btn-primary" style={{ marginTop: 12 }}>Create project</Link>
            </div>
          )}
        </div>
      </div>

      {/* Overdue Tasks */}
      {data?.overdueTasks?.length > 0 && (
        <div className="card" style={{ padding: 24, marginTop: 20, borderColor: 'rgba(248,113,113,0.15)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f87171', marginBottom: 16 }}>⚠ Overdue Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.overdueTasks.map((task) => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: '#1a0e0e' }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d6e0' }}>{task.title}</p>
                  <p style={{ fontSize: 11, color: '#6b4040', marginTop: 2 }}>{task.project?.name} · Due {fmtDate(task.dueDate)}</p>
                </div>
                <PriorityBadge priority={task.priority} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
