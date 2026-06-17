import { FileText } from "lucide-react";
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
          <FileText className="h-3.5 w-3.5 text-zinc-500" />
          <CardTitle>Transcript</CardTitle>
        </div>
        <CardDescription>
          Verbatim text from your last recording.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-2.5 rounded shimmer-bg animate-shimmer" />
            <div className="h-2.5 rounded shimmer-bg animate-shimmer w-[88%]" />
            <div className="h-2.5 rounded shimmer-bg animate-shimmer w-[72%]" />
            <div className="text-[11px] text-zinc-500 mt-3 font-mono">
              transcribing…
            </div>
          </div>
        ) : transcript ? (
          <p className="text-[13px] leading-relaxed text-zinc-200 whitespace-pre-wrap max-h-64 overflow-y-auto">
            {transcript}
          </p>
        ) : (
          <div className="text-[12px] text-zinc-600 py-2">
            No transcript yet. Record to see it here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
