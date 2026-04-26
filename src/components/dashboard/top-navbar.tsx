"use client";

import { Search, Radio, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "./sidebar-provider";
import { NotificationPanel } from "./notification-panel";
import { useUser } from "@/components/providers/user-provider";

export function TopNavbar() {
  const { toggle } = useSidebar();
  const { user } = useUser();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "A";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[240px] z-30 flex justify-between items-center px-4 md:px-6 h-16 border-b border-border glass-panel font-heading text-sm transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggle}
          className="p-2 -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg lg:hidden transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              className="w-full bg-white/50 border border-border rounded-full py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm backdrop-blur-sm shadow-inner"
              placeholder="Search across MarketPro..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Trailing Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Realtime Indicator */}
        <button onClick={() => alert("System telemetry is online.")} className="relative p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all group">
          <Radio className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </button>

        {/* Notifications */}
        <NotificationPanel />

        <div className="h-6 w-px bg-border mx-2" />

        {/* User Profile */}
        <Link href="/profile" className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-primary/5 transition-all border border-border shadow-sm">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md shadow-primary/30">
            {initials}
          </div>
          <span className="font-medium text-foreground hidden sm:inline">{user?.name || "Admin"}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
}
