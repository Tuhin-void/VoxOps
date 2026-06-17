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
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mostly zinc shades + the single accent cyan. Critical stays semantic rose.
const SEVERITY_COLORS: Record<string, string> = {
  Low: "#52525b",
  Medium: "#71717a",
  High: "#a1a1aa",
  Critical: "#fb7185",
  Unknown: "#3f3f46",
};

const STATUS_COLORS: Record<string, string> = {
  Open: "#22d3ee",
  "In Progress": "#a1a1aa",
  Closed: "#3f3f46",
};

const tooltipStyle = {
  background: "#0a0a0a",
  border: "1px solid #27272a",
  borderRadius: "6px",
  color: "#e4e4e7",
  fontSize: 11,
  padding: "6px 10px",
};

interface SeverityProps {
  data: Record<string, number>;
}

export function SeverityPie({ data }: SeverityProps) {
  const entries = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
  const total = entries.reduce((s, e) => s + e.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection Severity</CardTitle>
        <CardDescription>
          Distribution across all recorded inspections.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {total === 0 ? (
          <EmptyChart label="No inspections yet." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={entries}
                dataKey="value"
                nameKey="name"
                innerRadius={56}
                outerRadius={88}
                paddingAngle={2}
                stroke="#000"
                strokeWidth={2}
              >
                {entries.map((e) => (
                  <Cell
                    key={e.name}
                    fill={SEVERITY_COLORS[e.name] || "#3f3f46"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "transparent" }}
              />
              <Legend
                iconType="circle"
                iconSize={6}
                formatter={(v) => (
                  <span style={{ color: "#a1a1aa", fontSize: 11 }}>{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
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
        <CardDescription>Open, in progress, and closed.</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {total === 0 ? (
          <EmptyChart label="No work orders yet." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={entries}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
                axisLine={{ stroke: "#1f1f1f" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
                axisLine={{ stroke: "#1f1f1f" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {entries.map((e) => (
                  <Cell
                    key={e.name}
                    fill={STATUS_COLORS[e.name] || "#71717a"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-full w-full flex items-center justify-center text-[12px] text-zinc-600">
      {label}
    </div>
  );
}
