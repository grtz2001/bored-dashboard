import { Link } from "react-router-dom";

// The dark "try this right now" card inside the hero, with a random pick.
// Links into the pick's detail view and offers a "roll again" reshuffle.
function Spotlight({ pick, onSurprise }) {
  return (
    <div className="spotlight">
      <div className="spotlight-body">
        <div className="spotlight-kicker">Feeling bored right now? Try</div>
        <div className="spotlight-title">{pick.activity}</div>
        <div className="spotlight-meta">
          <span
            className="chip"
            style={{ background: pick.chipBg, color: pick.chipText }}
          >
            {pick.typeLabel}
          </span>
          <span>{pick.participantsLabel}</span>
          <span className="dot">·</span>
          <span>{pick.priceTier}</span>
        </div>
      </div>
      <div className="spotlight-actions">
        {/* Open the full detail view for the current pick */}
        <Link className="view-btn" to={`/activity/${encodeURIComponent(pick.key)}`}>
          View details →
        </Link>
        {/* Clicking asks the parent to pick a new random activity */}
        <button type="button" className="roll-btn" onClick={onSurprise}>
          ↻ Roll again
        </button>
      </div>
    </div>
  );
}

export default Spotlight;
