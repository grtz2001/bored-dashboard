import { TYPE_OPTIONS } from "../lib/activities.js";

// Search box + category dropdown + kid-friendly toggle. All controlled inputs;
// filtering happens client-side in the parent, so these just report changes.
function Controls({ search, onSearch, type, onType, kidOnly, onToggleKid }) {
  return (
    <div className="controls">
      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">🔍</span>
        {/* Controlled input: its value comes from state, and every keystroke
            calls onSearch so the parent updates and the list re-filters live. */}
        <input
          className="search-input"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search activities…"
          aria-label="Search activities by name"
        />
      </div>

      {/* Category dropdown — options built from the type list with .map() */}
      <select
        className="type-select"
        value={type}
        onChange={(e) => onType(e.target.value)}
        aria-label="Filter by category"
      >
        {TYPE_OPTIONS.map((opt) => (
          // `key` gives React a stable id for each option in the list
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Toggle button — the "active" class is added only when kidOnly is true */}
      <button
        type="button"
        className={`kid-toggle${kidOnly ? " active" : ""}`}
        aria-pressed={kidOnly}
        onClick={onToggleKid}
      >
        Kid-friendly only
      </button>
    </div>
  );
}

export default Controls;
