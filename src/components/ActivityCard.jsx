// One activity row/card, showing several attributes: type, price tier, name,
// participants, duration, a kid-friendly badge, and a "learn more" link.
function ActivityCard({ activity }) {
  return (
    <div className="activity-card">
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
        {/* "Learn more" link appears only when the activity has a URL */}
        {activity.hasLink && (
          <a
            className="learn-more"
            href={activity.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more →
          </a>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;
