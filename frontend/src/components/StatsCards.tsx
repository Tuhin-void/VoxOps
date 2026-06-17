import { ClipboardList, Wrench, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  totalInspections: number;
  openWorkOrders: number;
  criticalAlerts: number;
}

export function StatsCards({
  totalInspections,
  openWorkOrders,
  criticalAlerts,
}: Props) {
  const items = [
    {
      label: "Total Inspections",
      value: totalInspections,
      icon: ClipboardList,
      caption: "All-time records",
    },
    {
      label: "Open Work Orders",
      value: openWorkOrders,
      icon: Wrench,
      caption: "Awaiting action",
    },
    {
      label: "Critical Alerts",
      value: criticalAlerts,
      icon: AlertTriangle,
      caption: "Immediate review",
      emphasize: criticalAlerts > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {items.map((it) => (
        <Card key={it.label}>
          <div className="px-7 py-7 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide font-medium text-zinc-500">
                {it.label}
              </div>
              <div
                className={`text-4xl font-semibold tracking-tight tabular-nums ${
                  it.emphasize ? "text-red-400" : "text-zinc-50"
                }`}
              >
                {it.value}
              </div>
              <div className="text-xs text-zinc-600">{it.caption}</div>
            </div>
            <it.icon className="h-4 w-4 text-zinc-600 mt-1" strokeWidth={1.75} />
          </div>
        </Card>
      ))}
    </div>
  );
}
