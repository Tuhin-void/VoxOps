import { Activity, Mic } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VoiceLog } from "@/api/types";

interface Props {
  transcripts: VoiceLog[];
}

export function RecentActivity({ transcripts }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
            <CardTitle>Recent Transcripts</CardTitle>
          </div>
          <span className="text-[10px] font-mono text-zinc-600">
            {transcripts.length} entries
          </span>
        </div>
        <CardDescription>Latest voice reports from the field.</CardDescription>
      </CardHeader>
      <CardContent>
        {transcripts.length === 0 ? (
          <div className="flex items-start gap-3 py-1">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-canvas border border-hairline shrink-0">
              <Mic className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.75} />
            </span>
            <div>
              <div className="text-sm font-medium text-zinc-200">
                No transcripts yet
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                Field reports will appear here as workers record them.
              </div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-hairline/60 max-h-80 overflow-y-auto">
            {transcripts.map((t) => (
              <li key={t.id} className="py-3">
                <div className="text-sm text-zinc-300 break-words leading-relaxed">
                  {t.transcript}
                </div>
                <div className="text-[10px] text-zinc-600 font-mono mt-1">
                  {new Date(t.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
