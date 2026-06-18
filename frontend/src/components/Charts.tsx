import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Donut colors per spec — five buckets, four-color palette + neutral.
const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#EF4444",
  High: "#F59E0B",
  Medium: "#06B6D4",
  Low: "#10B981",
  Unknown: "#71717A",
};

// Bar colors — Open=cyan, In Progress=amber, Closed=emerald.
const STATUS_COLORS: Record<string, string> = {
  Open: "#06B6D4",
  "In Progress": "#F59E0B",
  Closed: "#10B981",
};

const tooltipStyle = {
  background: "#111113",
  border: "1px solid #27272A",
  borderRadius: "8px",
  color: "#FAFAFA",
  fontSize: 12,
  padding: "8px 10px",
};

// Fixed display order so the legend is consistent regardless of payload order.
const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low", "Unknown"];

interface SeverityProps {
  data: Record<string, number>;
}

export function SeverityPie({ data }: SeverityProps) {
  const entries = SEVERITY_ORDER.filter((k) => data[k] !== undefined).map(
    (name) => ({ name, value: data[name] || 0 })
  );
  // Tail any keys we don't know about so we never drop data.
  Object.entries(data).forEach(([k, v]) => {
    if (!SEVERITY_ORDER.includes(k)) entries.push({ name: k, value: v });
  });

  const total = entries.reduce((s, e) => s + e.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection Severity</CardTitle>
        <CardDescription>
          Distribution of recorded inspections.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-2">
        {total === 0 ? (
          <EmptyChart label="No inspections yet." />
        ) : (
          <>
            <div className="relative h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={entries}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                    cornerRadius={8}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {entries.map((e) => (
                      <Cell
                        key={e.name}
                        fill={SEVERITY_COLORS[e.name] || "#71717A"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "transparent" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-4xl font-semibold text-zinc-50 tabular-nums tracking-tight">
                  {total}
                </div>
                <div className="text-xs uppercase tracking-wide text-zinc-500 mt-1">
                  Total
                </div>
              </div>
            </div>

            {/* Custom legend — wraps cleanly on mobile, no overlap. */}
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8">
              {entries.map((e) => (
                <li key={e.name} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{
                      background: SEVERITY_COLORS[e.name] || "#71717A",
                    }}
                  />
                  <span className="text-sm text-zinc-400">{e.name}</span>
                  <span className="text-xs font-mono text-zinc-600 tabular-nums">
                    {e.value}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface StatusProps {
  data: Record<string, number>;
}

export function WorkOrderStatusBar({ data }: StatusProps) {
  const entries = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
  const total = entries.reduce((s, e) => s + e.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Orders by Status</CardTitle>
        <CardDescription>
          Open, in progress, and closed work orders.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-2">
        {total === 0 ? (
          <EmptyChart label="No work orders yet." />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={entries}
                margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#A1A1AA" }}
                  tickLine={false}
                  axisLine={{ stroke: "#27272A" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#A1A1AA" }}
                  tickLine={false}
                  axisLine={{ stroke: "#27272A" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {entries.map((e) => (
                    <Cell
                      key={e.name}
                      fill={STATUS_COLORS[e.name] || "#06B6D4"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-72 w-full flex items-center justify-center text-sm text-zinc-600">
      {label}
    </div>
  );
}
