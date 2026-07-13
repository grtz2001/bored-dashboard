// One activity row/card, showing several attributes: type, price tier, name,
// participants, duration, a kid-friendly badge, and a link into its detail view.
// Clicking anywhere on the card opens that activity's detail page.
function ActivityCard({ activity, onOpen }) {
  return (
    <div
      className="activity-card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(activity.key)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(activity.key);
        }
      }}
    >
      <div className="activity-top">
        {/* Colored category chip — its colors come from the enriched activity */}
        <span
          className="chip"
          style={{ background: activity.chipBg, color: activity.chipText }}
        >
          {activity.typeLabel}
        </span>
        {/* Price shown as a tier (Free / $ / $$ / $$$), not a raw number */}
        <span className="price-tier">{activity.priceTier}</span>
      </div>

      <div className="activity-name">{activity.activity}</div>

      <div className="activity-meta">
        <span>👥 {activity.participantsLabel}</span>
        {/* Only show the duration separator + value if a duration exists */}
        {activity.duration && (
          <>
            <span className="dot">·</span>
            <span>{activity.duration}</span>
          </>
        )}
      </div>

      <div className="activity-foot">
        {/* Badge appears only for kid-friendly activities */}
        {activity.kidFriendly && <span className="kid-badge">★ Kid-friendly</span>}
        {/* Affordance hinting the whole card opens the detail view */}
        <span className="learn-more details-link">Details →</span>
      </div>
    </div>
  );
}

export default ActivityCard;
