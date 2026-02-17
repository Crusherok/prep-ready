import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileSearch, Clock, Code, ClipboardCheck,
  BookOpen, User, CheckSquare, Rocket, Award, Menu, X,
} from "lucide-react";
import { useState } from "react";
import TopBar from "./TopBar";
import ProofFooter from "./ProofFooter";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze JD", to: "/analyze", icon: FileSearch },
  { label: "History", to: "/history", icon: Clock },
  { label: "Practice", to: "/practice", icon: Code },
  { label: "Assessments", to: "/assessments", icon: ClipboardCheck },
  { label: "Resources", to: "/resources", icon: BookOpen },
  { label: "Profile", to: "/profile", icon: User },
];

const BUILD_ITEMS = [
  { label: "Test Checklist", to: "/prp/07-test", icon: CheckSquare },
  { label: "Ship", to: "/prp/08-ship", icon: Rocket },
  { label: "Proof", to: "/prp/proof", icon: Award },
];

export default function AppShell() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavLink = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const active = location.pathname === item.to;
    return (
      <Link
        to={item.to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-in-out ${
          active
            ? "bg-primary text-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent"
        }`}
      >
        <item.icon size={18} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />

      <div className="flex flex-1">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-14 left-4 z-50 p-2 rounded-md bg-card border border-border"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-12 left-0 z-40 h-[calc(100vh-3rem)] w-60
            bg-sidebar border-r border-sidebar-border flex flex-col py-6 px-3 gap-1
            transition-transform duration-150 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</p>
          {NAV_ITEMS.map(item => <NavLink key={item.to} item={item} />)}

          <div className="my-4 border-t border-sidebar-border" />

          <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Build</p>
          {BUILD_ITEMS.map(item => <NavLink key={item.to} item={item} />)}
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10 max-w-6xl">
          <Outlet />
        </main>
      </div>

      <ProofFooter />
    </div>
  );
}
