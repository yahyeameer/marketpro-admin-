"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  ChevronDown,
  ListFilter,
  User,
  Search,
  Table2,
  LayoutGrid,
  MoreVertical,
} from "lucide-react";

// Mock Data from Stitch Design
const visitsData = [
  {
    id: 1,
    companyInitials: "AC",
    companyName: "Apex Corp Logistics",
    contactName: "Michael Chang, Director",
    phone: "(555) 019-2834",
    email: "m.chang@apexcorp.com",
    visitDate: "Oct 18, 2023",
    visitTime: "14:30 EST",
    status: "Interested",
    statusBadgeStyles:
      "bg-[#004b58]/30 text-[#53ddfc] border border-[#53ddfc]/20 shadow-[0_0_10px_rgba(83,221,252,0.1)]",
    statusDotColor: "bg-[#53ddfc]",
    agentName: "David R.",
    agentAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZJc9VmPLL6MCgHoxh3R0AO0sILTZA6V1jT8MYqDC-QDd2L-3cRrKe-z2H30G4P9aV4D8PcdOXiZ12ofwITkYfCXOeo6LWSNZg15sUXciZENtI4ONpgW1RTgx5h4oD2WCqoakaO-9YadZRZszp4rHaXL4j10N9laynnM75m_6yVC0lmwSYQfoRUKVUlYerR4woPlLqu0fnrPHvE3wJgixfkyBTdVntmZo9DHGnB1iXFpCO44JkYHsnWn6qtXZONuFSWLmtmIVWI38",
  },
  {
    id: 2,
    companyInitials: "N",
    companyName: "Nexus Healthcare",
    contactName: "Sarah Jenkins, VP Ops",
    phone: "(555) 847-9921",
    email: "s.jenkins@nexus.health",
    visitDate: "Oct 18, 2023",
    visitTime: "11:00 EST",
    status: "Follow-up",
    statusBadgeStyles:
      "bg-[#740044]/30 text-[#ff8cbc] border border-[#ff8cbc]/20 shadow-[0_0_10px_rgba(255,140,188,0.1)]",
    statusDotColor: "bg-[#ff8cbc]",
    agentName: "Elena G.",
    agentAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_hXAsmsXS1Mbo_dwzxS9Cekhj3gcEFiN-2J4ioEZSSvTtKnguuDgGrdrnuT03fYyD1YLMGaCU-EY0DewKdfMmpsc0Yf_GqXCF8MSIAX4bsGc3FPeNgtB4a--H6r1jzYJ6e6FbbD5N9fXeQfP3hkfuhezAEbT8TByL8eIDTnonKfrz2dfFLc_EwN5ufT7jnuAT7DfEdreW8Eude9u0D4lPjh_9E74XY8Qfer4qmHTPDDBZayKzLkzdQc8mpcALWZ9NN9A4OuAXSqo",
  },
  {
    id: 3,
    companyInitials: "V",
    companyName: "Vanguard Retail",
    contactName: "Tom Baker, Store Mgr",
    phone: "(555) 332-1100",
    email: "tbaker@vanguard.net",
    visitDate: "Oct 17, 2023",
    visitTime: "16:15 EST",
    status: "Not Interested",
    statusBadgeStyles:
      "bg-[#a70138]/30 text-[#ff6e84] border border-[#ff6e84]/20 shadow-[0_0_10px_rgba(255,110,132,0.1)]",
    statusDotColor: "bg-[#ff6e84]",
    agentName: "David R.",
    agentAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrL-Aa-IJf_fnnGw4L67cUyjyELbls6gtmR5AOFex-ZjAPtXt7q5Dmj1aKqCb9r4-hfR1oDcUNXOibZiHAxe0wuQ8jP8hYf7L0VUds9mQuMC2-blgZL3i40GSup09mrOoWAy-lry53RqJ1OxITBQkqu9_VtVO3hQXxCKapyuCYV6M3L0l5AOVHkqvr52_HqcNQ2-IzX9iSABPX0Y4hRldqa-0O739k0gX4SABARbjN0Ndsv4i2tkLr0ZI03kNzU6-dsHMknx2N820",
  },
  {
    id: 4,
    companyInitials: "O",
    companyName: "Omni Systems",
    contactName: "Jessica Wong, CTO",
    phone: "(555) 902-3844",
    email: "jwong@omni.sys",
    visitDate: "Oct 17, 2023",
    visitTime: "09:00 EST",
    status: "Pending Log",
    statusBadgeStyles:
      "bg-[#2a2a43] text-[#aba9bf] border border-[#e6e3fb]/10",
    statusDotColor: "bg-[#757388]",
    agentName: "Marcus T.",
    agentAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeaYFnJ3V6hNZpWkfCTYi5VUXpORiUtBxv0bODV8hTLMZ0_lEb5eKl7ZBVvwbuDE-1dHhoel21tUGY8xGEPg3wR76EP8TyAGzQIxiO-EsR1Zex4ubOUQ5JDwjjfCHOl8ETnFGI5hAmKf15lrFK10vjTZ80lHpghu_GPt150cRLigeYvMXtniBl1GbuXW09ah6_PWiaS38rpcuwOKGQfflFQEU0DPYF65MryehJKUqxzP8lomJt0tLfVwxhwxBXRIys8RvzyfcV6Hg",
  },
];

export default function VisitsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 lg:p-8 xl:p-10"
    >
      {/* Ambient Liquid Light Orbs (Specific to Visits page bg) */}
      <div className="fixed top-0 left-[240px] w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#40ceed] opacity-10 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#fa53a4] opacity-5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#e6e3fb] tracking-tight flex items-center gap-3">
              Field Visits
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#23233b] text-[#aba9bf] border border-white/5">
                24 Today
              </span>
            </h1>
            <p className="text-sm text-[#aba9bf] mt-1 max-w-2xl">
              Monitor active agent deployments, track outcomes, and manage
              follow-ups across all regional territories.
            </p>
          </div>
          <div className="shrink-0">
            <button className="h-10 px-5 rounded-lg bg-gradient-to-br from-[#bd9dff] to-[#ff6daf] text-white text-sm font-semibold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(189,157,255,0.3)] transition-all active:scale-95 group">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Add Visit
            </button>
          </div>
        </div>

        {/* Filter & Control Bar (Glass Panel) */}
        <div className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-2 mb-6 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          {/* Left: Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Date Picker */}
            <div className="relative">
              <button className="h-9 px-3 rounded-lg bg-[#111124] border border-white/5 flex items-center gap-2 text-sm text-[#e6e3fb] hover:bg-[#18182b] transition-colors">
                <Calendar className="w-4 h-4 text-[#aba9bf]" />
                <span>Oct 12 - Oct 19, 2023</span>
                <ChevronDown className="w-4 h-4 text-[#aba9bf] ml-1" />
              </button>
            </div>
            {/* Status Filter */}
            <div className="relative">
              <button className="h-9 px-3 rounded-lg bg-[#111124] border border-white/5 flex items-center gap-2 text-sm text-[#e6e3fb] hover:bg-[#18182b] transition-colors">
                <ListFilter className="w-4 h-4 text-[#aba9bf]" />
                <span>Status: All</span>
                <ChevronDown className="w-4 h-4 text-[#aba9bf] ml-1" />
              </button>
            </div>
            {/* Agent Filter */}
            <div className="relative">
              <button className="h-9 px-3 rounded-lg bg-[#111124] border border-white/5 flex items-center gap-2 text-sm text-[#e6e3fb] hover:bg-[#18182b] transition-colors">
                <User className="w-4 h-4 text-[#aba9bf]" />
                <span>Agent: Any</span>
                <ChevronDown className="w-4 h-4 text-[#aba9bf] ml-1" />
              </button>
            </div>
          </div>

          {/* Right: View Controls & Secondary Search */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <div className="relative w-full lg:w-64 hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aba9bf] w-4 h-4" />
              <input
                type="text"
                placeholder="Filter this view..."
                className="w-full h-9 bg-black border border-white/5 text-[#e6e3fb] text-sm rounded-lg pl-9 pr-3 focus:outline-none focus:border-[#53ddfc] focus:ring-1 focus:ring-[#53ddfc]/50 transition-all placeholder:text-white/30"
              />
            </div>
            <div className="h-6 w-px bg-white/10 hidden lg:block mx-1" />
            <div className="flex bg-[#111124] rounded-lg p-1 border border-white/5">
              <button
                onClick={() => setViewMode("table")}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                  viewMode === "table"
                    ? "bg-[#23233b] text-white shadow-sm"
                    : "text-[#aba9bf] hover:text-white"
                }`}
              >
                <Table2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#23233b] text-white shadow-sm"
                    : "text-[#aba9bf] hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table (Glass Container) */}
        <div className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#111124]/50">
                  <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider w-1/4">
                    Company & Contact
                  </th>
                  <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider">
                    Visit Details
                  </th>
                  <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {visitsData.map((visit) => (
                  <tr
                    key={visit.id}
                    className="group hover:bg-white/[0.02] transition-colors relative cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#18182b] flex items-center justify-center border border-white/10 text-[#bd9dff] font-heading font-bold overflow-hidden">
                          {visit.companyInitials}
                          <div className="absolute inset-0 bg-[#bd9dff]/0 group-hover:bg-[#bd9dff]/10 transition-colors pointer-events-none" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#e6e3fb] group-hover:text-[#bd9dff] transition-colors">
                            {visit.companyName}
                          </div>
                          <div className="text-xs text-[#aba9bf] mt-0.5">
                            {visit.contactName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#e6e3fb] font-mono text-xs">
                        {visit.phone}
                      </div>
                      <div className="text-[#aba9bf] text-xs mt-0.5">
                        {visit.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#e6e3fb]">{visit.visitDate}</div>
                      <div className="text-[#aba9bf] text-xs mt-0.5 font-mono">
                        {visit.visitTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${visit.statusBadgeStyles}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${visit.statusDotColor}`}
                        />
                        {visit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={visit.agentAvatar}
                          alt="Agent"
                          className="w-6 h-6 rounded-full border border-white/10"
                        />
                        <span className="text-[#e6e3fb]">{visit.agentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#aba9bf] hover:text-[#e6e3fb] p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                    {/* Row border hover highlight */}
                    <td className="absolute inset-y-0 left-0 w-1 bg-[#bd9dff] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[4px_0_12px_rgba(189,157,255,0.5)]" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bottom Bar */}
          <div className="border-t border-white/5 bg-[#111124]/30 px-6 py-3 flex items-center justify-between">
            <div className="text-xs text-[#aba9bf]">
              Showing <span className="font-mono text-[#e6e3fb]">1</span> to{" "}
              <span className="font-mono text-[#e6e3fb]">4</span> of{" "}
              <span className="font-mono text-[#e6e3fb]">128</span> entries
            </div>
            <div className="flex gap-1">
              <button
                disabled
                className="h-8 px-2 rounded flex items-center justify-center text-[#aba9bf] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              <button className="h-8 w-8 rounded flex items-center justify-center bg-[#bd9dff]/20 text-[#bd9dff] font-medium text-sm border border-[#bd9dff]/30">
                1
              </button>
              <button className="h-8 w-8 rounded flex items-center justify-center text-[#e6e3fb] hover:bg-white/5 transition-colors text-sm">
                2
              </button>
              <button className="h-8 w-8 rounded flex items-center justify-center text-[#e6e3fb] hover:bg-white/5 transition-colors text-sm">
                3
              </button>
              <span className="h-8 w-8 flex items-center justify-center text-[#aba9bf] text-sm">
                ...
              </span>
              <button className="h-8 w-8 rounded flex items-center justify-center text-[#e6e3fb] hover:bg-white/5 transition-colors text-sm">
                12
              </button>
              <button className="h-8 px-2 rounded flex items-center justify-center text-[#e6e3fb] hover:bg-white/5 transition-colors">
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
