import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/endpoints";
import { pingBackend } from "@/api/client";
import type { PendingTranscript } from "@/api/types";

const STORAGE_KEY = "voicepro:pendingQueue";

function readQueue(): PendingTranscript[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingTranscript[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(items: PendingTranscript[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useOfflineQueue() {
  const qc = useQueryClient();
  const [pending, setPending] = useState<PendingTranscript[]>(() => readQueue());
  const [online, setOnline] = useState<boolean>(true);
  const [syncing, setSyncing] = useState(false);

  const enqueue = useCallback((transcript: string) => {
    const next: PendingTranscript = {
      id: crypto.randomUUID(),
      transcript,
      timestamp: new Date().toISOString(),
    };
    const items = [...readQueue(), next];
    writeQueue(items);
    setPending(items);
  }, []);

  const flush = useCallback(async () => {
    const items = readQueue();
    if (items.length === 0) return 0;
    setSyncing(true);
    try {
      const res = await api.syncTranscripts(
        items.map((i) => ({ transcript: i.transcript, timestamp: i.timestamp }))
      );
      writeQueue([]);
      setPending([]);
      // Refresh dashboard + transcript-dependent caches so the supervisor view
      // immediately reflects the newly-synced items.
      qc.invalidateQueries({ queryKey: ["stats"] });
      return res.synced;
    } catch {
      return 0;
    } finally {
      setSyncing(false);
    }
  }, [qc]);

  // Check connectivity periodically and auto-flush when reachable again.
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const ok = await pingBackend();
      if (cancelled) return;
      setOnline(ok);
      if (ok && readQueue().length > 0) {
        await flush();
      }
    };
    check();
    const id = window.setInterval(check, 10_000);
    const onOnline = () => check();
    window.addEventListener("online", onOnline);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.removeEventListener("online", onOnline);
    };
  }, [flush]);

  return { pending, online, syncing, enqueue, flush };
}
