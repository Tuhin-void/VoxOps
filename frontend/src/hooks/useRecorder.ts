import { useCallback, useRef, useState } from "react";

export interface RecorderState {
  recording: boolean;
  error: string | null;
}

export function useRecorder() {
  const [state, setState] = useState<RecorderState>({ recording: false, error: null });
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stop = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const rec = mediaRef.current;
      if (!rec || rec.state === "inactive") {
        resolve(null);
        return;
      }
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: rec.mimeType || "audio/webm",
        });
        chunksRef.current = [];
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mediaRef.current = null;
        setState({ recording: false, error: null });
        resolve(blob);
      };
      rec.stop();
    });
  }, []);

  const start = useCallback(async () => {
    setState({ recording: false, error: null });
    if (!navigator.mediaDevices?.getUserMedia) {
      setState({ recording: false, error: "Microphone not supported in this browser." });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRef.current = rec;
      rec.start();
      setState({ recording: true, error: null });
    } catch (e: any) {
      const name = e?.name as string | undefined;
      let msg = "Could not access microphone.";
      if (name === "NotAllowedError" || name === "SecurityError") {
        msg = "Microphone permission denied. Allow access and try again.";
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        msg = "No microphone detected on this device.";
      } else if (name === "NotReadableError") {
        msg = "Microphone is in use by another application.";
      } else if (e?.message) {
        msg = e.message;
      }
      setState({ recording: false, error: msg });
    }
  }, []);

  return { ...state, start, stop };
}
