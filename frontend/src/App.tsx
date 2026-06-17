import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  HardHat,
  LayoutDashboard,
  Mic,
  Home,
  BookOpen,
  HelpCircle,
  Database,
  Menu,
  X,
  Github,
} from "lucide-react";
import { WorkerPage } from "@/pages/WorkerPage";
import { SupervisorDashboard } from "@/pages/SupervisorDashboard";
import { LandingPage } from "@/pages/LandingPage";
import { GettingStartedPage } from "@/pages/GettingStartedPage";
import { HelpPage } from "@/pages/HelpPage";
import { SampleDataPage } from "@/pages/SampleDataPage";
import { OnboardingModal } from "@/components/OnboardingModal";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/Tuhin-void/VoxOps";

const NAV: { to: string; label: string; icon: React.ReactNode }[] = [
  { to: "/", label: "Home", icon: <Home className="h-3.5 w-3.5" /> },
  {
    to: "/worker",
    label: "Worker",
    icon: <HardHat className="h-3.5 w-3.5" />,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-3.5 w-3.5" />,
  },
  {
    to: "/getting-started",
    label: "Start",
    icon: <BookOpen className="h-3.5 w-3.5" />,
  },
  { to: "/help", label: "Help", icon: <HelpCircle className="h-3.5 w-3.5" /> },
  {
    to: "/sample-data",
    label: "Sample",
    icon: <Database className="h-3.5 w-3.5" />,
  },
];

export function App() {
  return (
    <div className="min-h-screen flex flex-col text-zinc-100 bg-black">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/worker" element={<WorkerPage />} />
          <Route path="/dashboard" element={<SupervisorDashboard />} />
          <Route path="/getting-started" element={<GettingStartedPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/sample-data" element={<SampleDataPage />} />
        </Routes>
      </main>
      <Footer />
      <OnboardingModal />
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
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
          <span className="text-[15px] tracking-tight">VoxOps</span>
          <span className="text-[11px] text-zinc-600 font-mono hidden sm:inline">
            v1.0
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/60 transition-colors cursor-pointer"
            aria-label="GitHub repository"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="lg:hidden inline-flex items-center justify-center h-8 w-8 rounded-md text-zinc-300 hover:bg-zinc-900 cursor-pointer"
        >
          {mobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-900 bg-black animate-fade-in">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <NavItem key={item.to} {...item} mobile />
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavItem({
  to,
  icon,
  label,
  mobile,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  mobile?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer",
          mobile ? "px-3 py-2" : "px-3 py-1.5",
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

function Footer() {
  return (
    <footer className="border-t border-zinc-900 px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-1.5 items-center justify-between text-[11px] text-zinc-600 font-mono">
        <span>VoxOps · academic demo · MIT</span>
        <div className="flex items-center gap-3">
          <Link to="/help" className="hover:text-zinc-300 cursor-pointer">
            help
          </Link>
          <Link
            to="/getting-started"
            className="hover:text-zinc-300 cursor-pointer"
          >
            getting started
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-zinc-300 cursor-pointer"
          >
            github
          </a>
        </div>
      </div>
    </footer>
  );
}
