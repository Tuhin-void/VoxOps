import { Link, NavLink, Route, Routes } from "react-router-dom";
import { HardHat, LayoutDashboard, Mic } from "lucide-react";
import { WorkerPage } from "@/pages/WorkerPage";
import { SupervisorDashboard } from "@/pages/SupervisorDashboard";
import { cn } from "@/lib/utils";

export function App() {
  return (
    <div className="min-h-screen flex flex-col text-zinc-100 bg-black">
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-medium text-zinc-100 cursor-pointer"
          >
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-black">
              <Mic className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-accent-400 ring-2 ring-black" />
            </span>
            <span className="text-[15px] tracking-tight">VoicePro</span>
            <span className="text-[11px] text-zinc-600 font-mono hidden sm:inline">
              v1.0
            </span>
          </Link>
          <nav className="flex items-center gap-0.5">
            <NavItem
              to="/"
              icon={<HardHat className="h-3.5 w-3.5" />}
              label="Worker"
            />
            <NavItem
              to="/dashboard"
              icon={<LayoutDashboard className="h-3.5 w-3.5" />}
              label="Dashboard"
            />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<WorkerPage />} />
          <Route path="/dashboard" element={<SupervisorDashboard />} />
        </Routes>
      </main>

      <footer className="border-t border-zinc-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-1.5 items-center justify-between text-[11px] text-zinc-600 font-mono">
          <span>VoicePro · academic demo</span>
          <span>no auth · no PII · single tenant</span>
        </div>
      </footer>
    </div>
  );
}

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer",
          isActive
            ? "text-zinc-100 bg-zinc-900"
            : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/60"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
