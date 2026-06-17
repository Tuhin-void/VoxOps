import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { api } from "@/api/endpoints";
import { StatsCards } from "@/components/StatsCards";
import { SeverityPie, WorkOrderStatusBar } from "@/components/Charts";
import { RecentActivity } from "@/components/RecentActivity";
import { AlertsPanel } from "@/components/AlertsPanel";
import { Button } from "@/components/ui/button";

export function SupervisorDashboard() {
  const { data, isLoading, error, refetch, isFetching, dataUpdatedAt } =
    useQuery({
      queryKey: ["stats"],
      queryFn: api.stats,
      refetchInterval: 15_000,
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-500 text-[13px]">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading dashboard…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-[12px] text-rose-300 border border-rose-500/30 bg-rose-500/5 px-3 py-2 rounded-md">
        Could not load dashboard data. Is the backend running?
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        onRefresh={() => refetch()}
        refreshing={isFetching}
        lastUpdated={dataUpdatedAt}
      />

      <StatsCards
        totalInspections={data.total_inspections}
        openWorkOrders={data.open_work_orders}
        criticalAlerts={data.critical_alerts}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SeverityPie data={data.severity_breakdown} />
        <WorkOrderStatusBar data={data.work_order_status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentActivity transcripts={data.recent_transcripts} />
        <AlertsPanel inspections={data.recent_inspections} />
      </div>
    </div>
  );
}

function PageHeader({
  onRefresh,
  refreshing,
  lastUpdated,
}: {
  onRefresh: () => void;
  refreshing: boolean;
  lastUpdated: number;
}) {
  const stamp = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString()
    : "—";

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] font-medium text-zinc-500 mb-2">
          Supervisor
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight text-zinc-50">
          Field operations, at a glance.
        </h1>
        <p className="text-[13px] text-zinc-500 mt-1.5 max-w-xl leading-relaxed">
          KPI cards, severity distribution, and live activity. Auto-refresh
          every 15s.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-mono text-zinc-600">
          updated {stamp}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      </div>
    </div>
  );
}
