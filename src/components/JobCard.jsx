
// Colour config for each status
const STATUS_META = {
  Applied:   { color: "#3b82f6", bg: "#eff6ff", emoji: "🔵" },
  Interview: { color: "#f97316", bg: "#fff7ed", emoji: "🟠" },
  Offer:     { color: "#22c55e", bg: "#f0fdf4", emoji: "🟢" },
  Rejected:  { color: "#ef4444", bg: "#fef2f2", emoji: "🔴" },
};

// Format "2024-05-15" → "May 15, 2024"
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function JobCard({ job, onEdit, onDelete }) {
  const meta = STATUS_META[job.status] || STATUS_META["Applied"];

  return (
    <div className="job-card" style={{ borderLeftColor: meta.color }}>

      {/* ── Top row: company + status badge ── */}
      <div className="card-top">
        <div>
          <h3 className="card-company">{job.company}</h3>
          <p className="card-role">{job.role}</p>
        </div>
        <span
          className="status-badge"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.emoji} {job.status}
        </span>
      </div>

      {/* ── Meta row: date + notes ── */}
      <div className="card-meta">
        <span>📅 {formatDate(job.date)}</span>
        {job.notes && (
          <span className="card-notes" title={job.notes}>
            📝 {job.notes}
          </span>
        )}
      </div>

      {/* ── Action buttons ── */}
      <div className="card-actions">
        <button className="btn-edit"   onClick={onEdit}>✏️ Edit</button>
        <button className="btn-delete" onClick={onDelete}>🗑️ Delete</button>
      </div>

    </div>
  );
}

export default JobCard;
