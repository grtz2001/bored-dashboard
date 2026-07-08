// The dark "try this right now" card inside the hero, with a random pick.
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
          {pick.hasLink && (
            <>
              <span className="dot">·</span>
              <a href={pick.link} target="_blank" rel="noopener noreferrer" className="spotlight-link">
                learn more →
              </a>
            </>
          )}
        </div>
      </div>
      <button type="button" className="roll-btn" onClick={onSurprise}>
        ↻ Roll again
      </button>
    </div>
  );
}

export default Spotlight;
