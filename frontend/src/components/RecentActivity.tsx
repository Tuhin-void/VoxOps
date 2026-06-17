import { Activity } from "lucide-react";
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
            <Activity className="h-3.5 w-3.5 text-zinc-500" />
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
          <div className="text-[12px] text-zinc-600 py-2">
            No transcripts yet.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-900 max-h-80 overflow-y-auto">
            {transcripts.map((t) => (
              <li key={t.id} className="py-2.5">
                <div className="text-[12px] text-zinc-300 break-words leading-relaxed">
                  {t.transcript}
                </div>
                <div className="text-[10px] text-zinc-600 font-mono mt-0.5">
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
