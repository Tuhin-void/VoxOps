import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Wrench, Plus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge, statusVariant } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/api/endpoints";
import { useToast } from "@/components/ui/toast";
import type { WorkOrder } from "@/api/types";

const STATUSES = ["Open", "In Progress", "Closed"];

export function WorkOrderCard() {
  const qc = useQueryClient();
  const { notify } = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ["work-orders"],
    queryFn: api.listWorkOrders,
  });

  const [eq, setEq] = useState("");
  const [desc, setDesc] = useState("");

  const createMut = useMutation({
    mutationFn: () =>
      api.createWorkOrder({
        equipment_id: eq.trim().toUpperCase(),
        description: desc.trim() || undefined,
      }),
    onSuccess: () => {
      setEq("");
      setDesc("");
      qc.invalidateQueries({ queryKey: ["work-orders"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      notify("Work order created.", "success");
    },
    onError: (e: any) =>
      notify(e?.message || "Could not create work order.", "error"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.updateWorkOrder(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["work-orders"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e: any) =>
      notify(e?.message || "Could not update work order.", "error"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.deleteWorkOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["work-orders"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      notify("Work order deleted.", "success");
    },
    onError: (e: any) =>
      notify(e?.message || "Could not delete work order.", "error"),
  });

  const total = data?.length ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wrench className="h-3.5 w-3.5 text-zinc-500" />
            <CardTitle>Work Orders</CardTitle>
          </div>
          <span className="text-[11px] font-mono text-zinc-600">
            {total} total
          </span>
        </div>
        <CardDescription>Create, update, and close work orders.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (eq.trim() && !createMut.isPending) createMut.mutate();
          }}
        >
          <Input
            placeholder="P101"
            value={eq}
            onChange={(e) => setEq(e.target.value)}
            className="font-mono uppercase"
          />
          <Input
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <Button type="submit" disabled={!eq.trim() || createMut.isPending}>
            {createMut.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Create
          </Button>
        </form>

        {isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-12 rounded shimmer-bg animate-shimmer"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-[12px] text-rose-300 border border-rose-500/30 bg-rose-500/5 px-3 py-2 rounded-md">
            Could not load work orders.
          </div>
        ) : data && data.length > 0 ? (
          <ul className="divide-y divide-zinc-900">
            {data.map((wo: WorkOrder) => (
              <li key={wo.id} className="py-2.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-zinc-600">
                      #{wo.id}
                    </span>
                    <span className="font-mono text-[13px] text-zinc-100">
                      {wo.equipment_id}
                    </span>
                    <Badge variant={statusVariant(wo.status)}>
                      {wo.status}
                    </Badge>
                  </div>
                  {wo.description && (
                    <div className="text-[12px] text-zinc-400 mt-0.5 truncate">
                      {wo.description}
                    </div>
                  )}
                  <div className="text-[10px] text-zinc-600 font-mono mt-0.5">
                    {new Date(wo.created_at).toLocaleString()}
                  </div>
                </div>
                <select
                  className="text-[11px] border border-zinc-800 rounded-md px-2 py-1 bg-zinc-950 text-zinc-300 cursor-pointer hover:border-zinc-700 focus:outline-none focus:border-accent-400/60"
                  value={wo.status}
                  onChange={(e) =>
                    updateMut.mutate({ id: wo.id, status: e.target.value })
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={deleteMut.isPending}
                  onClick={() => {
                    if (deleteMut.isPending) return;
                    if (confirm(`Delete work order #${wo.id}?`)) {
                      deleteMut.mutate(wo.id);
                    }
                  }}
                  className="p-1 text-zinc-600 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label={`Delete work order ${wo.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[12px] text-zinc-600 py-2">
            No work orders yet. Create one above.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
