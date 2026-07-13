import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import DashboardView from "./components/DashboardView.jsx";
import DetailView from "./components/DetailView.jsx";
import AboutView from "./components/AboutView.jsx";
import {
  TYPES,
  enrich,
  applyFilter,
  computeStats,
  chartCategoryData,
  chartDurationData,
  byKey,
  randomOf,
} from "./lib/activities.js";
import "./App.css";

// Same-origin path proxied to https://bored-api.appbrewery.com (see
// vite.config.js).
const API = "/bored";

function App() {
  // Raw activities (API shape) plus load status.
  const [all, setAll] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  // Filter/UI state — all searching & filtering is client-side. Kept here (not
  // inside the dashboard view) so it survives navigating to a detail and back.
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [kidOnly, setKidOnly] = useState(false);
  const [pickKey, setPickKey] = useState(null);

  // Runs once after the first render (empty [] = no dependencies) to load data.
  useEffect(() => {
    // Guard so we don't update state if the component unmounts mid-fetch.
    let cancelled = false;

    async function load() {
      // Fetch all seven types in parallel, merge, and dedupe by key.
      try {
        // Promise.all fires every request at once and waits for all to finish.
        const results = await Promise.all(
          TYPES.map((t) =>
            fetch(`${API}/filter?type=${t}`)
              .then((r) => (r.ok ? r.json() : [])) // bad response → empty list
              .catch(() => []) // network error → empty list (don't crash)
          )
        );
        // results is an array-of-arrays; flatten it and drop anything without a key.
        const flat = results.flat().filter((a) => a && a.key);
        // A Map keyed by `key` removes duplicates; take just the values back out.
        const merged = Array.from(new Map(flat.map((a) => [a.key, a])).values());

        if (cancelled) return; // component gone — skip the state updates
        if (merged.length) {
          setAll(merged);
          setStatus("ready");
          setPickKey(randomOf(merged)?.key ?? null); // seed the spotlight pick
        } else {
          setStatus("error"); // got nothing usable back
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    // Cleanup: React calls this if the component unmounts before load() finishes.
    return () => {
      cancelled = true;
    };
  }, []);

  // Derived values. useMemo caches each result and only recomputes when one of
  // its listed dependencies changes — avoids redoing this work on every render.

  // Summary stats for the tiles up top and the sidebar's "at a glance".
  const stats = useMemo(() => computeStats(all), [all]);

  // Chart-ready data (built from the fetched activities).
  const chartCategory = useMemo(() => chartCategoryData(stats.counts), [stats.counts]);
  const chartDuration = useMemo(() => chartDurationData(all), [all]);

  // Short takeaways shown beneath each chart.
  const catInsight =
    stats.topTypeLabel !== "—"
      ? `${stats.topTypeLabel} leads with ${stats.topN} of ${stats.total} ideas.`
      : "Loading category mix…";
  const durInsight = useMemo(() => {
    const quick = all.filter((a) => a.duration === "minutes");
    const quickFree = quick.filter((a) => (a.price || 0) === 0).length;
    return quick.length ? `${Math.round((quickFree / quick.length) * 100)}% of quick picks are free` : "";
  }, [all]);

  // Apply the three filters, then shape each result for display.
  // Recomputes whenever the data or any filter changes.
  const filtered = useMemo(
    () => applyFilter(all, search, type, kidOnly).map(enrich),
    [all, search, type, kidOnly]
  );

  // Find the currently spotlighted activity by its key and shape it too.
  const pick = useMemo(() => enrich(byKey(all, pickKey)), [all, pickKey]);

  // Badge text/color reflect the current load status (ternary chain).
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
      <div className="shell">
        <Sidebar stats={stats} sourceLabel={sourceLabel} sourceDot={sourceDot} />

        <div className="main-col">
          {/* One <Route> per view; the detail path carries the activity key. */}
          <Routes>
            <Route
              path="/"
              element={
                <DashboardView
                  status={status}
                  pick={pick}
                  onSurprise={handleSurprise}
                  stats={stats}
                  chartCategory={chartCategory}
                  chartDuration={chartDuration}
                  catInsight={catInsight}
                  durInsight={durInsight}
                  search={search}
                  onSearch={setSearch}
                  type={type}
                  onType={setType}
                  kidOnly={kidOnly}
                  onToggleKid={() => setKidOnly((v) => !v)}
                  filtered={filtered}
                />
              }
            />
            <Route path="/activity/:key" element={<DetailView all={all} status={status} />} />
            <Route path="/about" element={<AboutView />} />
            {/* Unknown URL → send them back to the dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
