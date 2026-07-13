import Hero from "./Hero.jsx";
import StatsGrid from "./StatsGrid.jsx";
import Charts from "./Charts.jsx";
import Controls from "./Controls.jsx";
import ActivityList from "./ActivityList.jsx";

// The "/" route: hero + spotlight, summary stats, the two charts, the filter
// controls, and the results grid (with loading / error fallbacks).
function DashboardView({
  status,
  pick,
  onSurprise,
  stats,
  chartCategory,
  chartDuration,
  catInsight,
  durInsight,
  search,
  onSearch,
  type,
  onType,
  kidOnly,
  onToggleKid,
  filtered,
}) {
  return (
    <div className="panel">
      <Hero pick={pick} onSurprise={onSurprise} />

      <StatsGrid stats={stats} />

      {status === "ready" && (
        <Charts
          category={chartCategory}
          duration={chartDuration}
          catInsight={catInsight}
          durInsight={durInsight}
        />
      )}

      <Controls
        search={search}
        onSearch={onSearch}
        type={type}
        onType={onType}
        kidOnly={kidOnly}
        onToggleKid={onToggleKid}
      />

      {/* Show a loading state, then an error state, else the real list */}
      {status === "loading" ? (
        <div className="results">
          <div className="empty-state">
            <div className="empty-emoji">⏳</div>
            <div className="empty-title">Fetching activities…</div>
            <div className="empty-sub">Pulling live data from the Bored API.</div>
          </div>
        </div>
      ) : status === "error" ? (
        <div className="results">
          <div className="empty-state">
            <div className="empty-emoji">📡</div>
            <div className="empty-title">Couldn't load activities</div>
            <div className="empty-sub">
              The Bored API didn't respond — try refreshing in a moment.
            </div>
          </div>
        </div>
      ) : (
        <ActivityList activities={filtered} shownCount={filtered.length} total={stats.total} />
      )}
    </div>
  );
}

export default DashboardView;
