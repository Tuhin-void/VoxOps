import * as React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastCtx {
  notify: (message: string, kind?: ToastKind) => void;
}

const Ctx = React.createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const counter = React.useRef(0);

  const notify = React.useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = ++counter.current;
      setItems((xs) => [...xs, { id, message, kind }]);
      window.setTimeout(() => {
        setItems((xs) => xs.filter((x) => x.id !== id));
      }, 3500);
    },
    []
  );

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {items.map((t) => {
          const Icon =
            t.kind === "success"
              ? CheckCircle2
              : t.kind === "error"
              ? AlertCircle
              : Info;
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px] border border-hairline bg-surface animate-fade-in min-w-[280px] max-w-sm",
                t.kind === "success" && "text-emerald-300",
                t.kind === "error" && "text-red-300",
                t.kind === "info" && "text-zinc-100"
              )}
            >
              <Icon
                strokeWidth={1.75}
                className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  t.kind === "success" && "text-emerald-400",
                  t.kind === "error" && "text-red-400",
                  t.kind === "info" && "text-primary"
                )}
              />
              <span className="leading-snug">{t.message}</span>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(Ctx);
  if (!ctx) {
    return { notify: (_msg: string) => {} };
  }
  return ctx;
}
