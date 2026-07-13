import ActivityCard from "./ActivityCard.jsx";

// The results section: a count line, then either the grid of cards or an
// empty state when nothing matches the current filters.
function ActivityList({ activities, shownCount, total }) {
  // No matches after filtering → show the empty state instead of an empty grid
  const isEmpty = activities.length === 0;

  return (
    <div className="results">
      <div className="results-count">
        Showing {shownCount} of {total}
      </div>

      {isEmpty ? (
        <div className="empty-state">
          <div className="empty-emoji">🫥</div>
          <div className="empty-title">Nothing matches</div>
          <div className="empty-sub">Try a different search or clear the filters.</div>
        </div>
      ) : (
        <div className="activity-grid">
          {/* Render one card per activity; `key` uses the API's unique id */}
          {activities.map((a) => (
            <ActivityCard key={a.key} activity={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityList;
