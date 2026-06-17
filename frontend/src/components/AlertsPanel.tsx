import { AlertTriangle } from "lucide-react";
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
            <AlertTriangle className="h-3.5 w-3.5 text-zinc-500" />
            <CardTitle>Critical Alerts</CardTitle>
          </div>
          {alerts.length > 0 && (
            <span className="text-[10px] font-mono text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded">
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
          <div className="text-[12px] text-zinc-600 py-2">
            All clear. No active high or critical alerts.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-900 max-h-80 overflow-y-auto">
            {alerts.map((a) => (
              <li key={a.id} className="py-3 flex items-start gap-2.5">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                    a.severity === "Critical" ? "bg-rose-400" : "bg-orange-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[12px] text-zinc-100">
                      {a.equipment_id || "Unknown"}
                    </span>
                    <Badge variant={severityVariant(a.severity)}>
                      {a.severity}
                    </Badge>
                  </div>
                  <div className="text-[12px] text-zinc-400 mt-0.5">
                    {a.fault_description ||
                      a.inspection_result ||
                      "(no description)"}
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono mt-0.5">
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
