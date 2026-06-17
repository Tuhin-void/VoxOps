import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/api/endpoints";

interface AskResult {
  question: string;
  answer: string;
  sources: string[];
}

const SAMPLE_QUESTIONS = [
  "When was Pump P101 serviced last?",
  "Operating pressure of Valve V203?",
  "How do I replace filter F22?",
];

const SUPPORTS_TTS =
  typeof window !== "undefined" && "speechSynthesis" in window;

export function QueryPanel() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (SUPPORTS_TTS) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!SUPPORTS_TTS || !text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utteranceRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => {
    if (!SUPPORTS_TTS) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    stopSpeaking();
    try {
      const res = await api.query(q);
      setResult({ question: q, answer: res.answer, sources: res.sources });
      speak(res.answer);
    } catch (e: any) {
      setError(e?.message || "Query failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <CardTitle>Ask About Equipment</CardTitle>
        </div>
        <CardDescription>
          RAG over manuals, procedures, and specs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything…"
          />
          <Button type="submit" disabled={loading || !question.trim()}>
            {loading ? (
              <Loader2 strokeWidth={1.75} className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send strokeWidth={1.75} className="h-3.5 w-3.5" />
            )}
            Ask
          </Button>
        </form>

        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setQuestion(q);
                ask(q);
              }}
              className="cursor-pointer text-[11px] px-2 py-1 rounded-md bg-canvas text-zinc-400 border border-hairline hover:bg-surface hover:text-zinc-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-[12px] border border-red-500/30 bg-red-500/5 text-red-300 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-xl border border-hairline bg-canvas p-4 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs uppercase tracking-wide text-zinc-500 font-medium truncate">
                {result.question}
              </div>
              {SUPPORTS_TTS && (
                <button
                  type="button"
                  onClick={() =>
                    speaking ? stopSpeaking() : speak(result.answer)
                  }
                  className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-mono text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                  aria-label={speaking ? "Stop speaking" : "Speak answer"}
                >
                  {speaking ? (
                    <>
                      <VolumeX strokeWidth={1.75} className="h-3 w-3" />
                      stop
                    </>
                  ) : (
                    <>
                      <Volume2 strokeWidth={1.75} className="h-3 w-3 text-primary" />
                      play
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-zinc-100 text-sm leading-relaxed">
              {result.answer}
            </p>
            {result.sources.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-hairline/60">
                <span className="text-[10px] text-zinc-600 mr-0.5 font-mono">
                  sources
                </span>
                {result.sources.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface text-zinc-400 border border-hairline"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
