import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  LabelList,
} from "recharts";

// The two dashboard charts, side by side, drawn with Recharts. Both are built
// from the fetched data so they update as data changes (prep lives in
// lib/activities.js). Colors reuse the app's per-category / free-vs-paid hues.

const FREE_COLOR = "oklch(0.7 0.13 150)";
const PAID_COLOR = "oklch(0.7 0.15 55)";

// Shared axis tick styling so both charts match the rest of the UI.
const tickStyle = { fontSize: 12.5, fontWeight: 600, fill: "#5f5749" };

// A small themed tooltip used by both charts.
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tip">
      <div className="chart-tip-label">{label}</div>
      {payload.map((p) => (
        <div className="chart-tip-row" key={p.name}>
          <span className="chart-tip-dot" style={{ background: p.color || p.fill }} />
          <span className="chart-tip-name">{p.name}</span>
          <span className="chart-tip-val">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// Chart 1 — horizontal bars, one per category, sorted biggest-first.
function CategoryChart({ rows, insight }) {
  return (
    <div className="chart-card">
      <div className="chart-title">What kind of cure?</div>
      <div className="chart-sub">Activities by category</div>

      {/* Height scales with the number of categories so bars stay evenly spaced */}
      <ResponsiveContainer width="100%" height={rows.length * 30 + 8}>
        {/* layout="vertical" makes the bars horizontal (category on the Y axis) */}
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 22, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={88}
            tickLine={false}
            axisLine={false}
            tick={tickStyle}
          />
          <Tooltip cursor={{ fill: "rgba(80,60,30,0.05)" }} content={<ChartTooltip />} />
          <Bar dataKey="count" name="Activities" radius={[0, 6, 6, 0]} barSize={16}>
            {/* One Cell per row so each bar keeps its own category color */}
            {rows.map((r) => (
              <Cell key={r.label} fill={r.color} />
            ))}
            {/* Print the count at the end of each bar */}
            <LabelList dataKey="count" position="right" style={tickStyle} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-foot">{insight}</div>
    </div>
  );
}

// Chart 2 — one stacked bar per time bucket, split into free vs. paid.
function DurationChart({ rows, insight }) {
  return (
    <div className="chart-card">
      <div className="chart-title">Quick fix or a project?</div>
      <div className="chart-sub">Time commitment, split by cost</div>

      <ResponsiveContainer width="100%" height={rows.length * 46 + 8}>
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={64}
            tickLine={false}
            axisLine={false}
            tick={tickStyle}
          />
          <Tooltip cursor={{ fill: "rgba(80,60,30,0.05)" }} content={<ChartTooltip />} />
          {/* Shared stackId stacks Free + Paid into one bar per time bucket */}
          <Bar dataKey="free" name="Free" stackId="cost" fill={FREE_COLOR} barSize={20} radius={[6, 0, 0, 6]} />
          <Bar dataKey="paid" name="Paid" stackId="cost" fill={PAID_COLOR} barSize={20} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-foot dur-foot">
        <span className="legend">
          <span className="legend-dot legend-free" />Free
        </span>
        <span className="legend">
          <span className="legend-dot legend-paid" />Paid
        </span>
        <span className="dur-insight">{insight}</span>
      </div>
    </div>
  );
}

function Charts({ category, duration, catInsight, durInsight }) {
  return (
    <div className="charts">
      <CategoryChart rows={category} insight={catInsight} />
      <DurationChart rows={duration} insight={durInsight} />
    </div>
  );
}

export default Charts;
