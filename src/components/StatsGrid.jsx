// A single summary tile.
function StatCard({ tone, value, label }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// The row of four at-a-glance statistics.
function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      <StatCard tone="total" value={stats.total} label="activities to try" />
      <StatCard tone="free" value={stats.free} label={`totally free (${stats.freePct}%)`} />
      <StatCard tone="kid" value={`${stats.kidPct}%`} label={`kid-friendly (${stats.kid})`} />
      <StatCard tone="type" value={stats.topTypeLabel} label="most common type" />
    </div>
  );
}

export default StatsGrid;
