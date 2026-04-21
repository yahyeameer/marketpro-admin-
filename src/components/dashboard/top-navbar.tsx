"use client";

import { Search, Radio, Bell, ChevronDown } from "lucide-react";

export function TopNavbar() {
  return (
    <header className="fixed top-0 right-0 left-[240px] z-30 flex justify-between items-center px-6 h-16 border-b border-white/10 bg-[#0c0c1d]/30 backdrop-blur-xl font-heading text-sm transition-all duration-300 ease-in-out">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aba9bf] group-focus-within:text-[#53ddfc] transition-colors" />
          <input
            className="w-full bg-[#111124] border border-[#474659]/20 rounded-full py-2 pl-10 pr-4 text-[#e6e3fb] placeholder:text-[#aba9bf]/50 focus:outline-none focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 transition-all text-sm backdrop-blur-[32px] bg-opacity-50"
            placeholder="Search across MarketPro..."
            type="text"
          />
        </div>
      </div>

      {/* Trailing Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Realtime Indicator */}
        <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
          <Radio className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#53ddfc] rounded-full animate-pulse" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff6daf] rounded-full" />
        </button>

        <div className="h-6 w-px bg-[#474659]/30 mx-2" />

        {/* User Profile */}
        <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/10 transition-all border border-[#474659]/20 backdrop-blur-[32px] bg-white/[0.03]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bd9dff] to-[#ff6daf] flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <span className="font-medium text-white/90">Admin</span>
          <ChevronDown className="w-4 h-4 text-white/50" />
        </button>
      </div>
    </header>
  );
}
