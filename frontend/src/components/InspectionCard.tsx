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
          <ClipboardCheck className="h-3.5 w-3.5 text-zinc-500" />
          <CardTitle>Extracted Inspection</CardTitle>
        </div>
        <CardDescription>
          Structured fields parsed from your spoken report.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-9 rounded shimmer-bg animate-shimmer" />
            <div className="h-9 rounded shimmer-bg animate-shimmer" />
            <div className="text-[11px] text-zinc-500 font-mono">
              extracting…
            </div>
          </div>
        ) : !data ? (
          <div className="text-[12px] text-zinc-600 py-2">
            Extracted fields will appear here after a recording.
          </div>
        ) : (
          <>
            <dl className="divide-y divide-zinc-900">
              <Row label="Equipment">
                {data.equipment_id ? (
                  <span className="font-mono text-[13px] text-zinc-100">
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
                        className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
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

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center pt-1">
              <div className="relative flex-1">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
                <Input
                  placeholder="Location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-8 sm:max-w-xs"
                />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : saved ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
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
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-[11px] uppercase tracking-wide text-zinc-500 font-medium pt-0.5 shrink-0">
        {label}
      </dt>
      <dd className="text-[13px] text-zinc-200 text-right">{children}</dd>
    </div>
  );
}

function Dash() {
  return <span className="text-zinc-600">—</span>;
}
