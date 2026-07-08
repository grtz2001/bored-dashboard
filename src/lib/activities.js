// Shared logic for the Bored dashboard: the type catalog plus the pure helpers
// used to shape, filter, and summarize activities.

export const TYPES = [
  "education",
  "recreational",
  "social",
  "charity",
  "cooking",
  "relaxation",
  "busywork",
];

// Each type gets a display label and a hue used to color its chip.
export const TYPE_META = {
  education: { label: "Education", hue: 45 },
  recreational: { label: "Recreational", hue: 150 },
  social: { label: "Social", hue: 25 },
  charity: { label: "Charity", hue: 335 },
  cooking: { label: "Cooking", hue: 75 },
  relaxation: { label: "Relaxation", hue: 210 },
  busywork: { label: "Busywork", hue: 285 },
};

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

// Turn a raw API activity into the display-ready shape the components render.
export function enrich(a) {
  if (!a) return null;
  // Look up the type's label/color; fall back gracefully for unknown types.
  const meta = TYPE_META[a.type] || { label: a.type || "Other", hue: 60 };
  const price = typeof a.price === "number" ? a.price : 0;
  // Map the 0–1 price scale to human-readable tiers.
  const priceTier = price === 0 ? "Free" : price <= 0.33 ? "$" : price <= 0.66 ? "$$" : "$$$";
  const n = a.participants || 1; // default to 1 so the label always reads sensibly
  return {
    key: a.key,
    activity: a.activity,
    type: a.type,
    typeLabel: meta.label,
    chipBg: `oklch(0.93 0.05 ${meta.hue})`,
    chipText: `oklch(0.42 0.14 ${meta.hue})`,
    priceTier,
    participantsLabel: `${n} ${n === 1 ? "person" : "people"}`,
    duration: cap(a.duration),
    accessibility: a.accessibility || "",
    kidFriendly: !!a.kidFriendly,
    link: a.link || "",
    hasLink: !!(a.link && a.link.length),
  };
}

// Chain search + type + kid-friendly filters in a single pass. Search matches
// the activity name, case-insensitively.
export function applyFilter(all, search, type, kidOnly) {
  const q = (search || "").trim().toLowerCase();
  return all.filter(
    (a) =>
      (!q || (a.activity || "").toLowerCase().includes(q)) &&
      (type === "all" || a.type === type) &&
      (!kidOnly || a.kidFriendly)
  );
}

// The three-plus summary statistics shown up top.
export function computeStats(all) {
  const total = all.length;
  const free = all.filter((a) => (typeof a.price === "number" ? a.price : 0) === 0).length;
  const kid = all.filter((a) => a.kidFriendly).length;

  // Tally how many activities fall under each type...
  const counts = {};
  all.forEach((a) => {
    counts[a.type] = (counts[a.type] || 0) + 1;
  });
  // ...then find the type with the highest count (the "mode").
  let topType = null;
  let topN = -1;
  Object.keys(counts).forEach((t) => {
    if (counts[t] > topN) {
      topN = counts[t];
      topType = t;
    }
  });
  const meta = TYPE_META[topType];

  return {
    total,
    free,
    freePct: total ? Math.round((free / total) * 100) : 0,
    kid,
    kidPct: total ? Math.round((kid / total) * 100) : 0,
    topTypeLabel: meta ? meta.label : "—",
  };
}

// The dropdown options: "All categories" plus one per type.
export const TYPE_OPTIONS = [{ value: "all", label: "All categories" }].concat(
  TYPES.map((t) => ({ value: t, label: TYPE_META[t].label }))
);

// Pick a random item from a list (returns null when empty).
export function randomOf(list) {
  return list && list.length ? list[Math.floor(Math.random() * list.length)] : null;
}
