import { CloudOff, Cloud, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PendingTranscript } from "@/api/types";

interface Props {
  pending: PendingTranscript[];
  online: boolean;
  syncing: boolean;
  onFlush: () => void;
}

export function SyncQueueCard({ pending, online, syncing, onFlush }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {online ? (
              <Cloud className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
            ) : (
              <CloudOff className="h-4 w-4 text-red-400" strokeWidth={1.75} />
            )}
            <CardTitle>Sync Queue</CardTitle>
          </div>
          <ConnectionPill online={online} />
        </div>
        <CardDescription>
          {online
            ? "Connected. Queued items upload automatically."
            : "Offline — recordings saved locally and sync when reconnected."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="font-mono font-semibold text-zinc-50 text-base">
              {pending.length}
            </span>{" "}
            <span className="text-zinc-500">
              item{pending.length === 1 ? "" : "s"} pending
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onFlush}
            disabled={syncing || pending.length === 0}
          >
            {syncing ? (
              <Loader2 strokeWidth={1.75} className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw strokeWidth={1.75} className="h-3.5 w-3.5" />
            )}
            Sync now
          </Button>
        </div>
        {pending.length > 0 && (
          <ul className="text-[12px] divide-y divide-hairline/60">
            {pending.slice(-5).map((p) => (
              <li key={p.id} className="py-2.5">
                <div className="text-zinc-300 truncate">{p.transcript}</div>
                <div className="text-[10px] text-zinc-600 font-mono">
                  {new Date(p.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ConnectionPill({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded border ${
        online
          ? "border-emerald-500/40 text-emerald-400"
          : "border-red-500/40 text-red-400"
      }`}
    >
      <span
        className={`inline-flex h-1.5 w-1.5 rounded-full ${
          online ? "bg-emerald-400 animate-subtle-pulse" : "bg-red-400"
        }`}
      />
      {online ? "online" : "offline"}
    </span>
  );
}
