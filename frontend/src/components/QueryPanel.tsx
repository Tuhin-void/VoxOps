import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Volume2, Loader2 } from "lucide-react";
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

export function QueryPanel() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
    setAudioUrl(null);
    try {
      const res = await api.query(q);
      setResult({ question: q, answer: res.answer, sources: res.sources });
      try {
        setTtsLoading(true);
        const blob = await api.tts(res.answer);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const audio = new Audio(url);
        audioElRef.current = audio;
        audio.play().catch(() => {});
      } catch {
        /* TTS optional */
      } finally {
        setTtsLoading(false);
      }
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
          <Sparkles className="h-3.5 w-3.5 text-accent-400" />
          <CardTitle>Ask About Equipment</CardTitle>
        </div>
        <CardDescription>
          RAG over manuals, procedures, and specs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
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
              className="cursor-pointer text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-[12px] border border-rose-500/30 bg-rose-500/5 text-rose-300 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3.5 space-y-2.5 animate-fade-in-up">
            <div className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">
              {result.question}
            </div>
            <p className="text-zinc-100 text-[13px] leading-relaxed">
              {result.answer}
            </p>
            {result.sources.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-zinc-900">
                <span className="text-[10px] text-zinc-600 mr-0.5 font-mono">
                  sources
                </span>
                {result.sources.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            {audioUrl && (
              <div className="flex items-center gap-2 pt-1">
                <Volume2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <audio controls src={audioUrl} className="h-7 w-full" />
              </div>
            )}
            {ttsLoading && (
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                <Loader2 className="h-3 w-3 animate-spin" />
                generating voice…
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
