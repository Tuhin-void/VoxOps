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

// Four-color chart palette: cyan, emerald, amber, red.
const SEVERITY_COLORS: Record<string, string> = {
  Low: "#10B981", // emerald
  Medium: "#F59E0B", // amber
  High: "#F59E0B", // amber (saturated via stroke)
  Critical: "#EF4444", // red
  Unknown: "#3F3F46", // zinc
};

const STATUS_COLORS: Record<string, string> = {
  Open: "#06B6D4", // cyan
  "In Progress": "#F59E0B", // amber
  Closed: "#10B981", // emerald
};

const tooltipStyle = {
  background: "#111113",
  border: "1px solid #27272A",
  borderRadius: "8px",
  color: "#FAFAFA",
  fontSize: 12,
  padding: "8px 10px",
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
                innerRadius={58}
                outerRadius={90}
                paddingAngle={2}
                stroke="#09090B"
                strokeWidth={2}
              >
                {entries.map((e) => (
                  <Cell
                    key={e.name}
                    fill={SEVERITY_COLORS[e.name] || "#3F3F46"}
                    fillOpacity={e.name === "High" ? 0.75 : 1}
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
                  <span style={{ color: "#A1A1AA", fontSize: 12 }}>{v}</span>
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
                tick={{ fontSize: 11, fill: "#A1A1AA" }}
                tickLine={false}
                axisLine={{ stroke: "#27272A" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#A1A1AA" }}
                tickLine={false}
                axisLine={{ stroke: "#27272A" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {entries.map((e) => (
                  <Cell
                    key={e.name}
                    fill={STATUS_COLORS[e.name] || "#06B6D4"}
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
    <div className="h-full w-full flex items-center justify-center text-sm text-zinc-600">
      {label}
    </div>
  );
}
