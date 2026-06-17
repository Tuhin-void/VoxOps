import { AlertTriangle, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge, severityVariant } from "@/components/ui/badge";
import type { Inspection } from "@/api/types";

interface Props {
  inspections: Inspection[];
}

export function AlertsPanel({ inspections }: Props) {
  const alerts = inspections
    .filter((i) => i.severity === "High" || i.severity === "Critical")
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
            <CardTitle>Critical Alerts</CardTitle>
          </div>
          {alerts.length > 0 && (
            <span className="text-[10px] font-mono text-red-400 border border-red-500/40 px-1.5 py-0.5 rounded">
              {alerts.length} active
            </span>
          )}
        </div>
        <CardDescription>
          High and critical severity inspections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex items-start gap-3 py-1">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-canvas border border-hairline shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.75} />
            </span>
            <div>
              <div className="text-sm font-medium text-zinc-200">All clear</div>
              <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                No high or critical alerts at this time.
              </div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-hairline/60 max-h-80 overflow-y-auto">
            {alerts.map((a) => (
              <li key={a.id} className="py-3 flex items-start gap-3">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                    a.severity === "Critical" ? "bg-red-400" : "bg-amber-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm text-zinc-50">
                      {a.equipment_id || "Unknown"}
                    </span>
                    <Badge variant={severityVariant(a.severity)}>
                      {a.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-zinc-400 mt-1 leading-relaxed">
                    {a.fault_description ||
                      a.inspection_result ||
                      "(no description)"}
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono mt-1">
                    {new Date(a.timestamp).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
