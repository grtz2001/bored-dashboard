import { TYPE_OPTIONS } from "../lib/activities.js";

// Search box + category dropdown + kid-friendly toggle. All controlled inputs;
// filtering happens client-side in the parent, so these just report changes.
function Controls({ search, onSearch, type, onType, kidOnly, onToggleKid }) {
  return (
    <div className="controls">
      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          className="search-input"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search activities…"
          aria-label="Search activities by name"
        />
      </div>

      <select
        className="type-select"
        value={type}
        onChange={(e) => onType(e.target.value)}
        aria-label="Filter by category"
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

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
