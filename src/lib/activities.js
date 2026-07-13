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
  // A plain-language note that pairs with the tier on the detail view.
  const priceNote =
    price === 0 ? "No cost at all" : price <= 0.33 ? "Low cost" : price <= 0.66 ? "Moderate cost" : "Pricey";
  const n = a.participants || 1; // default to 1 so the label always reads sensibly
  const avail = typeof a.availability === "number" ? a.availability : 0;
  return {
    key: a.key,
    activity: a.activity,
    type: a.type,
    typeLabel: meta.label,
    hue: meta.hue,
    chipBg: `oklch(0.93 0.05 ${meta.hue})`,
    chipText: `oklch(0.42 0.14 ${meta.hue})`,
    // Soft tinted background used behind the detail view's header.
    heroBg: `oklch(0.95 0.04 ${meta.hue})`,
    priceTier,
    priceNote,
    participants: n,
    participantsWord: n === 1 ? "solo" : "people",
    participantsLabel: `${n} ${n === 1 ? "person" : "people"}`,
    duration: cap(a.duration),
    availabilityPct: Math.round(avail * 100),
    accessibility: a.accessibility || "",
    kidFriendly: !!a.kidFriendly,
    link: a.link || "",
    hasLink: !!(a.link && a.link.length),
  };
}

// Look up a single raw activity by its key (returns null when absent).
export function byKey(all, key) {
  return all.find((a) => a.key === key) || null;
}

// Other activities of the same type, shaped for display (excludes the current
// one). Used for the "More … ideas" section on the detail view.
export function relatedActivities(all, activity, limit = 4) {
  if (!activity) return [];
  return all
    .filter((a) => a.type === activity.type && a.key !== activity.key)
    .slice(0, limit)
    .map(enrich);
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
    counts, // per-type tally, reused by the category chart
    topN, // count of the most common type
  };
}

// Duration buckets, in the order we want to show them on the chart.
export const DUR_ORDER = ["minutes", "hours", "days"];
export const DUR_LABEL = { minutes: "Minutes", hours: "Hours", days: "Days" };

// Chart 1 data: one row per category (that has entries), sorted biggest-first.
// Shaped for a Recharts bar chart — `count` is the value, `color` the bar fill.
export function chartCategoryData(counts) {
  return TYPES.map((t) => ({
    label: TYPE_META[t].label,
    count: counts[t] || 0,
    color: `oklch(0.68 0.13 ${TYPE_META[t].hue})`,
  }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);
}

// Chart 2 data: activities grouped by time commitment, each split into free vs.
// paid counts. Shaped for a stacked Recharts bar chart.
export function chartDurationData(all) {
  const buckets = {};
  DUR_ORDER.forEach((d) => (buckets[d] = { free: 0, paid: 0 }));
  all.forEach((a) => {
    const d = DUR_ORDER.includes(a.duration) ? a.duration : null;
    if (!d) return;
    const price = typeof a.price === "number" ? a.price : 0;
    if (price === 0) buckets[d].free++;
    else buckets[d].paid++;
  });
  return DUR_ORDER.filter((d) => buckets[d].free + buckets[d].paid > 0).map((d) => ({
    label: DUR_LABEL[d],
    free: buckets[d].free,
    paid: buckets[d].paid,
    total: buckets[d].free + buckets[d].paid,
  }));
}

// The dropdown options: "All categories" plus one per type.
export const TYPE_OPTIONS = [{ value: "all", label: "All categories" }].concat(
  TYPES.map((t) => ({ value: t, label: TYPE_META[t].label }))
);

// Pick a random item from a list (returns null when empty).
export function randomOf(list) {
  return list && list.length ? list[Math.floor(Math.random() * list.length)] : null;
}
