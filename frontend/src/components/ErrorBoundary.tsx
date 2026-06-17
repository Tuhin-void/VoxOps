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
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary]", error, info);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-canvas px-6 text-zinc-100">
          <div className="bg-surface border border-hairline rounded-3xl max-w-md w-full p-7 text-center space-y-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-red-500/10 border border-red-500/30 mx-auto">
              <AlertOctagon
                strokeWidth={1.75}
                className="h-5 w-5 text-red-400"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Something went wrong</h1>
              <p className="text-sm text-zinc-500 mt-1">
                A client-side error was caught. Reload the page to recover.
              </p>
            </div>
            <pre className="text-left text-[11px] font-mono bg-canvas border border-hairline rounded-md p-3 text-zinc-400 overflow-x-auto">
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <RotateCw strokeWidth={1.75} className="h-3.5 w-3.5" />
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
