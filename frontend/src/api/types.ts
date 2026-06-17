export interface TranscriptionResponse {
  transcript: string;
}

export interface InspectionExtracted {
  equipment_id: string | null;
  fault_description: string | null;
  severity: string | null;
  action_taken: string | null;
  parts_required: string[];
}

export interface Inspection extends InspectionExtracted {
  id: number;
  location: string | null;
  inspection_result: string | null;
  timestamp: string;
}

export interface WorkOrder {
  id: number;
  equipment_id: string;
  status: string;
  description: string | null;
  created_at: string;
}

export interface VoiceLog {
  id: number;
  transcript: string;
  timestamp: string;
}

export interface QueryResponse {
  answer: string;
  sources: string[];
}

export interface DashboardStats {
  total_inspections: number;
  open_work_orders: number;
  critical_alerts: number;
  severity_breakdown: Record<string, number>;
  work_order_status: Record<string, number>;
  recent_transcripts: VoiceLog[];
  recent_inspections: Inspection[];
}

export interface PendingTranscript {
  id: string;
  transcript: string;
  timestamp: string;
}
