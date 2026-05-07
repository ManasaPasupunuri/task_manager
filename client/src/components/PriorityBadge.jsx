const cfg = {
  LOW:    { label: 'Low',    bg: '#1a2235', color: '#8b90a7' },
  MEDIUM: { label: 'Medium', bg: '#2d2a1a', color: '#fb923c' },
  HIGH:   { label: 'High',   bg: '#2d1a1a', color: '#f87171' },
};

export default function PriorityBadge({ priority }) {
  const c = cfg[priority] || cfg.MEDIUM;
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
