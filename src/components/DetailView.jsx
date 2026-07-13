import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { enrich, byKey, relatedActivities } from "../lib/activities.js";

// The single-activity view, reached via a unique URL (/activity/:key). Shows
// extra info not on the dashboard card, a copyable direct link, and related
// ideas of the same type. Renders a "not found" state for stale links.
function DetailView({ all, status }) {
  // Pull the activity key straight out of the URL.
  const { key } = useParams();
  const [copied, setCopied] = useState(false);

  // Look the activity up and shape it for display.
  const raw = useMemo(() => byKey(all, key), [all, key]);
  const detail = useMemo(() => enrich(raw), [raw]);
  const related = useMemo(() => relatedActivities(all, raw), [all, raw]);
  // Only "not found" once data has loaded — otherwise the key just isn't in yet.
  const notFound = status === "ready" && !raw;

  // A shareable absolute URL for this exact activity.
  const permalink = `${window.location.origin}/activity/${encodeURIComponent(key)}`;

  // Jump to the top and reset the copy button whenever the activity changes.
  useEffect(() => {
    setCopied(false);
    try {
      window.scrollTo(0, 0);
    } catch {
      /* ignore */
    }
  }, [key]);

  function handleCopy() {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      /* clipboard may be unavailable — ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  if (notFound) {
    return (
      <div className="panel">
        <div className="empty-state detail-empty">
          <div className="empty-emoji">🧭</div>
          <div className="empty-title">Activity not found</div>
          <div className="empty-sub">That link may be stale.</div>
          <Link to="/" className="back-link back-link-block">← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  // Still loading the dataset — show a light placeholder.
  if (!detail) {
    return (
      <div className="panel">
        <div className="empty-state detail-empty">
          <div className="empty-emoji">⏳</div>
          <div className="empty-title">Fetching activity…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      {/* header */}
      <div className="detail-hero" style={{ background: detail.heroBg }}>
        <Link to="/" className="back-link">← Back to dashboard</Link>
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
            <button type="button" className="copy-btn" onClick={handleCopy}>
              {copied ? "Copied ✓" : "Copy link"}
            </button>
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
              <Link
                key={r.key}
                className="related-item"
                to={`/activity/${encodeURIComponent(r.key)}`}
              >
                <span className="related-name">{r.activity}</span>
                <span className="related-price">{r.priceTier}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailView;
