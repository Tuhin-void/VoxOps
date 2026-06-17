import * as React from "react";
import { AlertOctagon, RotateCw } from "lucide-react";

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (typeof window !== "undefined") {
      // surface to devtools so reviewers can inspect
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary]", error, info);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black px-6 text-zinc-100">
          <div className="surface rounded-xl max-w-md w-full p-6 text-center space-y-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-500/10 border border-rose-500/30 mx-auto">
              <AlertOctagon className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-base font-semibold">Something went wrong</h1>
              <p className="text-[12px] text-zinc-500 mt-1">
                A client-side error was caught. Reload the page to recover.
              </p>
            </div>
            <pre className="text-left text-[11px] font-mono bg-zinc-950 border border-zinc-800 rounded-md p-3 text-zinc-400 overflow-x-auto">
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium bg-zinc-100 text-black px-3 py-1.5 rounded-md hover:bg-white cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
