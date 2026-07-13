import { NavLink, useNavigate } from "react-router-dom";

// The dark rail shared by every view: brand, nav, a mini "at a glance" summary,
// and the live-data status badge. NavLink auto-applies the "active" class for
// the current route, so the highlight tracks the URL for free.
function Sidebar({ stats, sourceLabel, sourceDot }) {
  const navigate = useNavigate();

  // Builds the nav-item className, adding "active" when the route matches.
  const navClass = ({ isActive }) => `nav-item${isActive ? " active" : ""}`;

  // "Search" isn't its own route — go to the dashboard and focus the search box.
  function goSearch() {
    navigate("/");
    setTimeout(() => document.getElementById("dash-search")?.focus(), 60);
  }

  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">✦</span>
        <span className="brand-name">Bored?</span>
      </NavLink>

      <nav className="side-nav">
        {/* `end` so "/" is only active on the exact dashboard path */}
        <NavLink to="/" end className={navClass}>
          <span className="nav-icon" aria-hidden="true">▦</span>
          Dashboard
        </NavLink>
        <button type="button" className="nav-item" onClick={goSearch}>
          <span className="nav-icon" aria-hidden="true">⌕</span>
          Search
        </button>
        <NavLink to="/about" className={navClass}>
          <span className="nav-icon" aria-hidden="true">ⓘ</span>
          About
        </NavLink>
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
