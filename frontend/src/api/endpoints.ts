import { getJson, postFormData, postJson, putJson } from "./client";
import type {
  DashboardStats,
  Inspection,
  InspectionExtracted,
  QueryResponse,
  TranscriptionResponse,
  WorkOrder,
} from "./types";

export const api = {
  transcribe: (blob: Blob, filename = "recording.webm") => {
    const form = new FormData();
    form.append("audio", blob, filename);
    return postFormData<TranscriptionResponse>("/transcribe", form);
  },

  extract: (transcript: string) =>
    postJson<InspectionExtracted>("/extract", { transcript }),

  saveInspection: (payload: Partial<Inspection>) =>
    postJson<Inspection>("/inspections", payload),

  listInspections: () => getJson<Inspection[]>("/inspections"),

  query: (question: string) =>
    postJson<QueryResponse>("/query", { question }),

  listWorkOrders: () => getJson<WorkOrder[]>("/work-orders"),

  createWorkOrder: (payload: { equipment_id: string; description?: string; status?: string }) =>
    postJson<WorkOrder>("/work-orders", payload),

  updateWorkOrder: (id: number, payload: { status?: string; description?: string }) =>
    putJson<WorkOrder>(`/work-orders/${id}`, payload),

  deleteWorkOrder: (id: number) =>
    fetch(`/api/work-orders/${id}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error("Failed to delete work order");
    }),

  syncTranscripts: (items: { transcript: string; timestamp?: string }[]) =>
    postJson<{ synced: number }>("/sync", { items }),

  stats: () => getJson<DashboardStats>("/dashboard/stats"),
};
