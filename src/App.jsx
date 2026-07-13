import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Hero from "./components/Hero.jsx";
import StatsGrid from "./components/StatsGrid.jsx";
import Charts from "./components/Charts.jsx";
import Controls from "./components/Controls.jsx";
import ActivityList from "./components/ActivityList.jsx";
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
  relatedActivities,
  randomOf,
} from "./lib/activities.js";
import "./App.css";

// Same-origin path proxied to https://bored-api.appbrewery.com (see
// vite.config.js).
const API = "/bored";

// Parse the hash into a route: dashboard (default), a single activity, or about.
function parseHash() {
  const h = window.location.hash || "";
  const m = h.match(/#\/activity\/(.+)$/);
  if (m) return { view: "detail", key: decodeURIComponent(m[1]) };
  if (/#\/about/.test(h)) return { view: "about", key: null };
  return { view: "dashboard", key: null };
}

function App() {
  // Raw activities (API shape) plus load status.
  const [all, setAll] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  // Filter/UI state — all searching & filtering is client-side.
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [kidOnly, setKidOnly] = useState(false);
  const [pickKey, setPickKey] = useState(null);

  // Which view we're on, driven by the URL hash (gives each detail its own URL).
  const [route, setRoute] = useState(parseHash);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

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

  // Keep the route in sync with the URL hash (back/forward + direct links work).
  useEffect(() => {
    function onHash() {
      setRoute(parseHash());
      setCopied(false); // reset the copy button when navigating
      try {
        window.scrollTo(0, 0);
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Clear any pending "Copied ✓" reset timer on unmount.
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Navigation helpers — all routing goes through the URL hash.
  const goHome = (e) => {
    if (e) e.preventDefault();
    window.location.hash = "#/";
  };
  const goDetail = (key) => {
    window.location.hash = `#/activity/${encodeURIComponent(key)}`;
  };
  const goAbout = (e) => {
    if (e) e.preventDefault();
    window.location.hash = "#/about";
  };
  // "Search" in the sidebar: go to the dashboard and focus the search box.
  const focusSearch = (e) => {
    if (e) e.preventDefault();
    goHome();
    setTimeout(() => document.getElementById("dash-search")?.focus(), 60);
  };

  function handleCopy() {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      /* clipboard may be unavailable — ignore */
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1600);
  }

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

  // The activity behind the current detail URL (plus its related ideas).
  const detailRaw = route.view === "detail" ? byKey(all, route.key) : null;
  const detail = useMemo(() => enrich(detailRaw), [detailRaw]);
  const related = useMemo(() => relatedActivities(all, detailRaw), [all, detailRaw]);
  // Only "not found" once data has loaded — otherwise the key just isn't in yet.
  const notFound = route.view === "detail" && status === "ready" && !detailRaw;
  const permalink =
    route.view === "detail" && route.key
      ? `${window.location.href.split("#")[0]}#/activity/${encodeURIComponent(route.key)}`
      : "";

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
        <Sidebar
          view={route.view}
          stats={stats}
          sourceLabel={sourceLabel}
          sourceDot={sourceDot}
          onHome={goHome}
          onSearch={focusSearch}
          onAbout={goAbout}
        />

        <div className="main-col">
          {/* ---- ABOUT VIEW ---- */}
          {route.view === "about" ? (
            <AboutView onHome={goHome} />
          ) : /* ---- DETAIL VIEW ---- */ route.view === "detail" ? (
            status === "loading" ? (
              <div className="panel">
                <div className="empty-state detail-empty">
                  <div className="empty-emoji">⏳</div>
                  <div className="empty-title">Fetching activity…</div>
                </div>
              </div>
            ) : (
              <DetailView
                detail={detail}
                notFound={notFound}
                related={related}
                permalink={permalink}
                copyLabel={copied ? "Copied ✓" : "Copy link"}
                onCopy={handleCopy}
                onHome={goHome}
                onOpen={goDetail}
              />
            )
          ) : (
            /* ---- DASHBOARD VIEW ---- */
            <div className="panel">
              <Hero pick={pick} onOpen={goDetail} onSurprise={handleSurprise} />

              <StatsGrid stats={stats} />

              {status === "ready" && (
                <Charts
                  category={chartCategory}
                  duration={chartDuration}
                  catInsight={catInsight}
                  durInsight={durInsight}
                />
              )}

              <Controls
                search={search}
                onSearch={setSearch}
                type={type}
                onType={setType}
                kidOnly={kidOnly}
                onToggleKid={() => setKidOnly((v) => !v)}
              />

              {/* Show a loading state, then an error state, else the real list */}
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
                  onOpen={goDetail}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
