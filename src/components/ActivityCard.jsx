import { Link } from "react-router-dom";

// One activity card, showing several attributes: type, price tier, name,
// participants, duration, and a kid-friendly badge. The whole card is a Link
// into that activity's detail route (keyboard-accessible for free).
function ActivityCard({ activity }) {
  return (
    <Link className="activity-card" to={`/activity/${encodeURIComponent(activity.key)}`}>
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
    </Link>
  );
}

export default ActivityCard;
