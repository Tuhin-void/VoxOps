import { FileText, Mic } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  transcript: string;
  loading?: boolean;
}

export function TranscriptCard({ transcript, loading }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
          <CardTitle>Transcript</CardTitle>
        </div>
        <CardDescription>
          Verbatim text from your last recording.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2.5">
            <div className="h-3 skeleton" />
            <div className="h-3 skeleton w-[88%]" />
            <div className="h-3 skeleton w-[72%]" />
            <div className="text-[11px] text-zinc-500 mt-4 font-mono">
              transcribing…
            </div>
          </div>
        ) : transcript ? (
          <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap max-h-64 overflow-y-auto">
            {transcript}
          </p>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-canvas border border-hairline shrink-0">
        <Mic className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.75} />
      </span>
      <div>
        <div className="text-sm font-medium text-zinc-200">No transcript yet</div>
        <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
          Try saying:
        </div>
        <div className="mt-1.5 text-xs font-mono text-zinc-300 leading-relaxed">
          "Inspection complete for Pump P101. Severe vibration detected."
        </div>
      </div>
    </div>
  );
}
