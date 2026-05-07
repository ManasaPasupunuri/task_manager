const cfg = {
  TODO:        { label: 'To Do',       bg: '#1e3a5f', color: '#60a5fa' },
  IN_PROGRESS: { label: 'In Progress', bg: '#3b2f1a', color: '#fbbf24' },
  DONE:        { label: 'Done',        bg: '#14332a', color: '#34d399' },
};

export default function StatusBadge({ status }) {
  const c = cfg[status] || cfg.TODO;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 600,
      background: c.bg,
      color: c.color,
      letterSpacing: '0.02em',
    }}>
      {c.label}
    </span>
  );
}
