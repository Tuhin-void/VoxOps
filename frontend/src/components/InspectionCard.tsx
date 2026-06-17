import { useEffect, useState } from "react";
import { ClipboardCheck, Save, Loader2, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge, severityVariant } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { InspectionExtracted } from "@/api/types";

interface Props {
  data: InspectionExtracted | null;
  loading?: boolean;
  onSave: (
    payload: InspectionExtracted & { location?: string }
  ) => Promise<void>;
}

export function InspectionCard({ data, loading, onSave }: Props) {
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(false);
  }, [data]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      await onSave({ ...data, location: location || undefined });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
          <CardTitle>Extracted Inspection</CardTitle>
        </div>
        <CardDescription>
          Structured fields parsed from your spoken report.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <div className="space-y-2.5">
            <div className="h-9 skeleton" />
            <div className="h-9 skeleton" />
            <div className="text-[11px] text-zinc-500 font-mono">
              extracting…
            </div>
          </div>
        ) : !data ? (
          <EmptyState />
        ) : (
          <>
            <dl className="divide-y divide-hairline/60">
              <Row label="Equipment">
                {data.equipment_id ? (
                  <span className="font-mono text-sm text-zinc-50">
                    {data.equipment_id}
                  </span>
                ) : (
                  <Dash />
                )}
              </Row>
              <Row label="Severity">
                {data.severity ? (
                  <Badge variant={severityVariant(data.severity)}>
                    {data.severity}
                  </Badge>
                ) : (
                  <Dash />
                )}
              </Row>
              <Row label="Fault">
                {data.fault_description || <Dash />}
              </Row>
              <Row label="Action taken">
                {data.action_taken || <Dash />}
              </Row>
              <Row label="Parts">
                {data.parts_required.length ? (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {data.parts_required.map((p) => (
                      <span
                        key={p}
                        className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-canvas text-zinc-300 border border-hairline"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Dash />
                )}
              </Row>
            </dl>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center pt-1">
              <div className="relative flex-1">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" strokeWidth={1.75} />
                <Input
                  placeholder="Location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-8 sm:max-w-xs"
                />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 strokeWidth={1.75} className="h-3.5 w-3.5 animate-spin" />
                ) : saved ? (
                  <Check strokeWidth={1.75} className="h-3.5 w-3.5" />
                ) : (
                  <Save strokeWidth={1.75} className="h-3.5 w-3.5" />
                )}
                {saving ? "Saving" : saved ? "Saved" : "Save inspection"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="text-xs uppercase tracking-wide text-zinc-500 font-medium pt-0.5 shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-zinc-200 text-right">{children}</dd>
    </div>
  );
}

function Dash() {
  return <span className="text-zinc-600">—</span>;
}

function EmptyState() {
  return (
    <div className="flex items-start gap-3 py-1">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-canvas border border-hairline shrink-0">
        <ClipboardCheck className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.75} />
      </span>
      <div>
        <div className="text-sm font-medium text-zinc-200">
          No inspection yet
        </div>
        <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
          Record an inspection and the structured fields appear here.
        </div>
      </div>
    </div>
  );
}
