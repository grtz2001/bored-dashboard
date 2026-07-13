// The single-activity view, reached via a unique URL (#/activity/<key>). Shows
// extra info not on the dashboard card, a copyable direct link, and related
// ideas of the same type. Renders a "not found" state for stale links.
function DetailView({ detail, notFound, related, permalink, copyLabel, onCopy, onHome, onOpen }) {
  if (notFound) {
    return (
      <div className="panel">
        <div className="empty-state detail-empty">
          <div className="empty-emoji">🧭</div>
          <div className="empty-title">Activity not found</div>
          <div className="empty-sub">That link may be stale.</div>
          <a href="#/" className="back-link back-link-block" onClick={onHome}>
            ← Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="panel">
      {/* header */}
      <div className="detail-hero" style={{ background: detail.heroBg }}>
        <a href="#/" className="back-link" onClick={onHome}>← Back to dashboard</a>
        <div className="detail-chips">
          <span className="chip" style={{ background: detail.chipBg, color: detail.chipText }}>
            {detail.typeLabel}
          </span>
          {detail.kidFriendly && <span className="kid-badge">★ Kid-friendly</span>}
        </div>
        <h1 className="detail-title">{detail.activity}</h1>
      </div>

      {/* meta grid */}
      <div className="detail-meta">
        <div className="meta-card">
          <div className="meta-key">Cost</div>
          <div className="meta-val price">{detail.priceTier}</div>
          <div className="meta-note">{detail.priceNote}</div>
        </div>
        <div className="meta-card">
          <div className="meta-key">Group size</div>
          <div className="meta-val">{detail.participants}</div>
          <div className="meta-note">{detail.participantsWord}</div>
        </div>
        <div className="meta-card">
          <div className="meta-key">Time</div>
          <div className="meta-val">{detail.duration || "—"}</div>
          <div className="meta-note">to complete</div>
        </div>
        <div className="meta-card">
          <div className="meta-key">Availability</div>
          <div className="meta-val">{detail.availabilityPct}%</div>
          <div className="avail-track">
            <div
              className="avail-bar"
              style={{ width: `${detail.availabilityPct}%`, background: `oklch(0.65 0.13 ${detail.hue})` }}
            />
          </div>
        </div>
      </div>

      {/* extra info */}
      <div className="detail-info">
        <div className="info-card">
          <div className="meta-key">Accessibility</div>
          <div className="info-text">{detail.accessibility || "Not specified"}</div>
        </div>

        {/* permalink */}
        <div className="permalink-card">
          <div className="meta-key permalink-key">Direct link to this activity</div>
          <div className="permalink-row">
            <code className="permalink-code">{permalink}</code>
            <button type="button" className="copy-btn" onClick={onCopy}>{copyLabel}</button>
          </div>
          {detail.hasLink && (
            <div className="permalink-external">
              <a href={detail.link} target="_blank" rel="noopener noreferrer" className="external-link">
                Open external resource ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="related">
          <div className="related-title">More {detail.typeLabel} ideas</div>
          <div className="related-grid">
            {related.map((r) => (
              <button
                key={r.key}
                type="button"
                className="related-item"
                onClick={() => onOpen(r.key)}
              >
                <span className="related-name">{r.activity}</span>
                <span className="related-price">{r.priceTier}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailView;
