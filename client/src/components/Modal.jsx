export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: 24 }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div className="card relative z-10 w-full slide-up" style={{ maxWidth: 480, padding: 28, borderColor: '#2a3050' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f0f1f5' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: 'none', background: 'transparent', color: '#6b7190', cursor: 'pointer', fontSize: 16 }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
