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
  { to: "/", label: "Home", icon: <Home strokeWidth={1.75} className="h-4 w-4" /> },
  {
    to: "/worker",
    label: "Worker Console",
    icon: <HardHat strokeWidth={1.75} className="h-4 w-4" />,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard strokeWidth={1.75} className="h-4 w-4" />,
  },
  {
    to: "/getting-started",
    label: "Getting Started",
    icon: <BookOpen strokeWidth={1.75} className="h-4 w-4" />,
  },
  {
    to: "/help",
    label: "Help",
    icon: <HelpCircle strokeWidth={1.75} className="h-4 w-4" />,
  },
  {
    to: "/sample-data",
    label: "Sample Data",
    icon: <Database strokeWidth={1.75} className="h-4 w-4" />,
  },
];

export function App() {
  return (
    <div className="min-h-screen flex flex-col text-zinc-50 bg-canvas">
      <Header />
      <main className="flex-1 w-full max-w-page mx-auto px-6 sm:px-8 py-10 sm:py-12">
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
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="max-w-page mx-auto px-6 sm:px-8 h-[72px] grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-medium text-zinc-50 cursor-pointer justify-self-start"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-zinc-50 text-black">
            <Mic className="h-3.5 w-3.5" strokeWidth={2.25} />
            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-canvas" />
          </span>
          <span className="text-[15px] tracking-tight">VoxOps</span>
          <span className="text-[11px] text-zinc-600 font-mono hidden sm:inline">
            v1.0
          </span>
        </Link>

        {/* Center: nav (desktop) */}
        <nav className="hidden lg:flex items-center justify-self-center h-full">
          {NAV.map((item) => (
            <DesktopNavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Right: GitHub (desktop) + mobile toggle */}
        <div className="justify-self-end flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-zinc-300 border border-hairline hover:bg-surface hover:text-zinc-50 transition-colors cursor-pointer"
            aria-label="GitHub repository"
          >
            <Github className="h-4 w-4" strokeWidth={1.75} />
            GitHub
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-zinc-300 hover:bg-surface cursor-pointer transition-colors"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-hairline bg-canvas animate-fade-in">
          <nav className="max-w-page mx-auto px-6 py-3 flex flex-col gap-0.5">
            {NAV.map((item) => (
              <MobileNavItem key={item.to} {...item} />
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-zinc-400 hover:text-zinc-50 hover:bg-surface transition-colors cursor-pointer"
            >
              <Github className="h-4 w-4" strokeWidth={1.75} />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function DesktopNavItem({
  to,
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
          "relative h-full flex items-center px-4 text-[13px] font-medium transition-colors cursor-pointer",
          isActive ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span className="absolute left-3 right-3 -bottom-px h-[1.5px] bg-primary" />
          )}
        </>
      )}
    </NavLink>
  );
}

function MobileNavItem({
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
          "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors cursor-pointer",
          isActive
            ? "text-zinc-50 bg-surface"
            : "text-zinc-400 hover:text-zinc-100 hover:bg-surface/60"
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
    <footer className="border-t border-hairline px-6 sm:px-8 py-5">
      <div className="max-w-page mx-auto flex flex-col sm:flex-row gap-2 items-center justify-between text-[11px] text-zinc-600 font-mono">
        <span>VoxOps · academic demo · MIT</span>
        <div className="flex items-center gap-4">
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
