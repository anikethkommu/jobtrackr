

function StatsBar({ jobs }) {
  // Count jobs per status
  const counts = jobs.reduce(
    (acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    },
    { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 }
  );

  const cards = [
    { label: "Total",      value: jobs.length,          accent: "#818cf8" },
    { label: "Applied",    value: counts.Applied,        accent: "#60a5fa" },
    { label: "Interviews", value: counts.Interview,      accent: "#fb923c" },
    { label: "Offers",     value: counts.Offer,          accent: "#4ade80" },
    { label: "Rejected",   value: counts.Rejected,       accent: "#f87171" },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className="stat-card"
          style={{ "--accent": card.accent }}
        >
          <span className="stat-number">{card.value}</span>
          <span className="stat-label">{card.label}</span>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
