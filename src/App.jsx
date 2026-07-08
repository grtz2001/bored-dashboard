import { useState, useEffect, useMemo } from "react";
import Hero from "./components/Hero.jsx";
import StatsGrid from "./components/StatsGrid.jsx";
import Controls from "./components/Controls.jsx";
import ActivityList from "./components/ActivityList.jsx";
import {
  TYPES,
  enrich,
  applyFilter,
  computeStats,
  randomOf,
} from "./lib/activities.js";
import "./App.css";

// Same-origin path proxied to https://bored-api.appbrewery.com (see
// vite.config.js). The Bored API sends no CORS headers, so browsers block a
// direct fetch — routing through the dev-server proxy avoids CORS entirely.
const API = "/bored";

function App() {
  // Raw activities (API shape) plus load status.
  const [all, setAll] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  // Filter/UI state — all searching & filtering is client-side.
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [kidOnly, setKidOnly] = useState(false);
  const [pickKey, setPickKey] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Fetch all seven types in parallel, merge, and dedupe by key.
      try {
        const results = await Promise.all(
          TYPES.map((t) =>
            fetch(`${API}/filter?type=${t}`)
              .then((r) => (r.ok ? r.json() : []))
              .catch(() => [])
          )
        );
        const flat = results.flat().filter((a) => a && a.key);
        const merged = Array.from(new Map(flat.map((a) => [a.key, a])).values());

        if (cancelled) return;
        if (merged.length) {
          setAll(merged);
          setStatus("ready");
          setPickKey(randomOf(merged)?.key ?? null);
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Derived, memoized so we don't recompute on unrelated re-renders.
  const stats = useMemo(() => computeStats(all), [all]);

  const filtered = useMemo(
    () => applyFilter(all, search, type, kidOnly).map(enrich),
    [all, search, type, kidOnly]
  );

  const pick = useMemo(() => {
    const raw = all.find((a) => a.key === pickKey);
    return enrich(raw);
  }, [all, pickKey]);

  const sourceLabel =
    status === "ready"
      ? "Live data"
      : status === "error"
        ? "Couldn't reach the API"
        : "Loading live data…";

  const sourceDot =
    status === "ready"
      ? "oklch(0.7 0.15 150)"
      : status === "error"
        ? "oklch(0.62 0.2 25)"
        : "#c9bfae";

  // Roll again picks from the current filtered pool (or everything if empty).
  function handleSurprise() {
    const pool = applyFilter(all, search, type, kidOnly);
    const next = randomOf(pool.length ? pool : all);
    setPickKey(next?.key ?? null);
  }

  return (
    <main className="page">
      <div className="dashboard">
        <Hero
          sourceLabel={sourceLabel}
          sourceDot={sourceDot}
          pick={pick}
          onSurprise={handleSurprise}
        />

        <StatsGrid stats={stats} />

        <Controls
          search={search}
          onSearch={setSearch}
          type={type}
          onType={setType}
          kidOnly={kidOnly}
          onToggleKid={() => setKidOnly((v) => !v)}
        />

        {status === "loading" ? (
          <div className="results">
            <div className="empty-state">
              <div className="empty-emoji">⏳</div>
              <div className="empty-title">Fetching activities…</div>
              <div className="empty-sub">Pulling live data from the Bored API.</div>
            </div>
          </div>
        ) : status === "error" ? (
          <div className="results">
            <div className="empty-state">
              <div className="empty-emoji">📡</div>
              <div className="empty-title">Couldn't load activities</div>
              <div className="empty-sub">
                The Bored API didn't respond — try refreshing in a moment.
              </div>
            </div>
          </div>
        ) : (
          <ActivityList
            activities={filtered}
            shownCount={filtered.length}
            total={stats.total}
          />
        )}
      </div>
    </main>
  );
}

export default App;
