// The dark rail shared by every view: brand, nav, a mini "at a glance" summary,
// and the live-data status badge. `view` is the current route so we can
// highlight the active nav item.
function Sidebar({ view, stats, sourceLabel, sourceDot, onHome, onSearch, onAbout }) {
  // Each nav item: label, icon, whether it's active, and its click handler.
  const nav = [
    { label: "Dashboard", icon: "▦", active: view === "dashboard", onClick: onHome },
    { label: "Search", icon: "⌕", active: false, onClick: onSearch },
    { label: "About", icon: "ⓘ", active: view === "about", onClick: onAbout },
  ];

  return (
    <aside className="sidebar">
      <a href="#/" className="brand" onClick={onHome}>
        <span className="brand-mark">✦</span>
        <span className="brand-name">Bored?</span>
      </a>

      <nav className="side-nav">
        {nav.map((n) => (
          <button
            key={n.label}
            type="button"
            className={`nav-item${n.active ? " active" : ""}`}
            onClick={n.onClick}
          >
            <span className="nav-icon" aria-hidden="true">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div className="glance">
        <div className="glance-title">At a glance</div>
        <div className="glance-rows">
          <div className="glance-row">
            <span className="glance-key">Activities</span>
            <span className="glance-val">{stats.total}</span>
          </div>
          <div className="glance-row">
            <span className="glance-key">Free</span>
            <span className="glance-val">{stats.free}</span>
          </div>
          <div className="glance-row">
            <span className="glance-key">Kid-friendly</span>
            <span className="glance-val">{stats.kid}</span>
          </div>
        </div>
      </div>

      <div className="side-source">
        <span className="source-dot" style={{ background: sourceDot }} />
        {sourceLabel}
      </div>
    </aside>
  );
}

export default Sidebar;
