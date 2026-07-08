// One activity row/card, showing several attributes: type, price tier, name,
// participants, duration, a kid-friendly badge, and a "learn more" link.
function ActivityCard({ activity }) {
  return (
    <div className="activity-card">
      <div className="activity-top">
        <span
          className="chip"
          style={{ background: activity.chipBg, color: activity.chipText }}
        >
          {activity.typeLabel}
        </span>
        <span className="price-tier">{activity.priceTier}</span>
      </div>

      <div className="activity-name">{activity.activity}</div>

      <div className="activity-meta">
        <span>👥 {activity.participantsLabel}</span>
        {activity.duration && (
          <>
            <span className="dot">·</span>
            <span>{activity.duration}</span>
          </>
        )}
      </div>

      <div className="activity-foot">
        {activity.kidFriendly && <span className="kid-badge">★ Kid-friendly</span>}
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
