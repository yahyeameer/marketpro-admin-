"use client";

import { motion } from "framer-motion";
import { Plus, User, Clock, CheckCircle2, Mail, Archive } from "lucide-react";

export default function LeadsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 lg:p-8 xl:p-10 relative z-10"
    >
      {/* Liquid Light Orbs (Background) */}
      <div
        className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(64, 206, 237, 0.2) 0%, rgba(12, 12, 29, 0) 70%)",
        }}
      />
      <div
        className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 83, 164, 0.15) 0%, rgba(12, 12, 29, 0) 70%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
          <div>
            <h2 className="text-3xl font-heading font-bold text-[#e6e3fb] mb-2">
              Lead Pipeline
            </h2>
            <p className="text-[#aba9bf] text-sm max-w-xl">
              Track and manage prospective clients through the sales cycle. High
              priority targets are highlighted.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-[#000000] font-heading font-semibold text-sm hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all duration-300 flex items-center gap-2 shrink-0">
            <Plus className="w-5 h-5" />
            New Lead
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Column 1: Inbound Leads */}
          <div className="flex flex-col bg-white/[0.03] rounded-[2rem] p-4 backdrop-blur-[32px] border border-[#474659]/30 shadow-[0_0_60px_rgba(138,76,252,0.08)] h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#40ceed] shadow-[0_0_10px_rgba(64,206,237,0.5)]" />
                <h3 className="font-heading font-bold text-[#e6e3fb] text-lg">
                  Inbound Leads
                </h3>
              </div>
              <span className="bg-[#23233b] text-[#aba9bf] text-xs font-bold font-mono px-2.5 py-1 rounded-full">
                24
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent">
              {/* Card 1 */}
              <div className="bg-[#1d1d33] rounded-xl p-5 border border-[#474659]/30 hover:border-[#40ceed]/50 transition-colors cursor-grab relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#40ceed] opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-heading font-bold text-[#e6e3fb]">
                    Acme Corp Global
                  </h4>
                  <span className="text-xs font-mono text-[#aba9bf]">2h ago</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#bd9dff]/10 flex items-center justify-center border border-[#bd9dff]/20">
                    <User className="w-3 h-3 text-[#bd9dff]" />
                  </div>
                  <span className="text-sm text-[#aba9bf]">
                    Sarah Jenkins, VP Growth
                  </span>
                </div>
                <p className="text-xs text-[#aba9bf] mb-4 line-clamp-2 italic">
                  Requested a demo regarding enterprise features. specifically
                  interested in API integration...
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div className="flex -space-x-2">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOOb5W6DPpXShUU2P5CByrEKy1Ies5NRyGs2E_SblHOHKjwUg6tld1sR5V0fEvA9gVgvLIrlolWEwkY-4-gHAZNl2fcY3qlPpnoEcKS-h35QbxEYKJQT_H61Qc5h1IEgNu9rBFoguGjaQ23tfTb1sLlhJdt_NwuBj4JfehT0f4IitzRqOp4z-1p8lIbBH_2nefY82yjCZOQWdb2HC-a-Qo9zHuNsvA3W9BpEPJNlnej4J109yvKFfUL-XinbQB8fb2sEhR57OhhRc"
                      alt="Agent"
                      className="w-6 h-6 rounded-full border border-[#1d1d33] z-10"
                    />
                  </div>
                  <span className="text-xs font-medium text-[#40ceed] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Follow up today
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#1d1d33] rounded-xl p-5 border border-[#474659]/30 hover:border-[#40ceed]/50 transition-colors cursor-grab relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#23233b] group-hover:bg-[#40ceed]/50 transition-colors" />
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-heading font-bold text-[#e6e3fb]">
                    Nexus Technologies
                  </h4>
                  <span className="text-xs font-mono text-[#aba9bf]">1d ago</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#23233b] flex items-center justify-center border border-[#474659]/30">
                    <User className="w-3 h-3 text-[#aba9bf]" />
                  </div>
                  <span className="text-sm text-[#aba9bf]">David Chen, CTO</span>
                </div>
                <p className="text-xs text-[#aba9bf] mb-4 line-clamp-2 italic">
                  Initial contact via webinar registration. Needs technical deep
                  dive.
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#23233b] border border-[#1d1d33] z-10 flex items-center justify-center text-[10px] text-[#e6e3fb] font-bold">
                      MK
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#aba9bf] flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Sent info packet
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Converted */}
          <div className="flex flex-col bg-white/[0.03] rounded-[2rem] p-4 backdrop-blur-[32px] border border-[#474659]/30 shadow-[0_0_60px_rgba(138,76,252,0.08)] h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00687a] shadow-[0_0_10px_rgba(0,104,122,0.5)]" />
                <h3 className="font-heading font-bold text-[#e6e3fb] text-lg">
                  Converted
                </h3>
              </div>
              <span className="bg-[#23233b] text-[#aba9bf] text-xs font-bold font-mono px-2.5 py-1 rounded-full">
                12
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent">
              {/* Card 3 */}
              <div className="bg-[#1d1d33] rounded-xl p-5 border border-[#474659]/30 relative overflow-hidden opacity-90">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00687a]" />
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-heading font-bold text-[#e6e3fb]">
                    Vanguard Logistics
                  </h4>
                  <span className="text-xs font-mono text-[#aba9bf]">Oct 12</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#00687a]/20 flex items-center justify-center border border-[#00687a]/30">
                    <CheckCircle2 className="w-3 h-3 text-[#53ddfc]" />
                  </div>
                  <span className="text-sm text-[#aba9bf]">Contract Signed</span>
                </div>
                <div className="bg-black/50 rounded-lg p-3 mb-4 flex justify-between items-center">
                  <span className="text-xs text-[#aba9bf]">Deal Value</span>
                  <span className="text-sm font-bold font-mono text-[#bd9dff]">
                    $45,000
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div className="flex -space-x-2">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd7D4GQcZLNdsOgOGQ62n7T0xwh6mgCy0ZPzeDAolDypDfVmdFi5zIryhMD8nv5vodmEy5aOhhJadp0PxibH88zCJpppkgXr3Fdlx-rl-TWyz-eLHFO5W0uEzGGzu_EWYeFGCRanLyS4eT-yIa5atxd2G3HIyq3eV_TxCY6QlRKnspXxraoygrnAJkvBRcZXdg8BVNTnfcjb9k_hqour0RYUSEoYSCvmh96U7YMXVqeCaawj8YxfrsT_L3rN4JBPRml7n5v4Ruo-s"
                      alt="Agent"
                      className="w-6 h-6 rounded-full border border-[#1d1d33] z-10"
                    />
                  </div>
                  <span className="text-xs font-medium text-[#aba9bf]">
                    Handed to CSM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Lost */}
          <div className="flex flex-col bg-white/[0.03] rounded-[2rem] p-4 backdrop-blur-[32px] border border-[#474659]/30 shadow-[0_0_60px_rgba(138,76,252,0.08)] h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#ff6e84] shadow-[0_0_10px_rgba(255,110,132,0.5)]" />
                <h3 className="font-heading font-bold text-[#e6e3fb] text-lg">
                  Lost
                </h3>
              </div>
              <span className="bg-[#23233b] text-[#aba9bf] text-xs font-bold font-mono px-2.5 py-1 rounded-full">
                8
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent">
              {/* Card 4 */}
              <div className="bg-[#1d1d33] rounded-xl p-5 border border-[#474659]/30 relative overflow-hidden opacity-75 grayscale-[30%]">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff6e84]/50" />
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-heading font-bold text-[#e6e3fb] line-through decoration-[#ff6e84]/50">
                    Starlight Retail
                  </h4>
                  <span className="text-xs font-mono text-[#aba9bf]">Sep 28</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-[#aba9bf]">
                    Marcus Thorne, CEO
                  </span>
                </div>
                <p className="text-xs text-[#d73357] mb-4 italic bg-[#a70138]/10 p-2 rounded border border-[#a70138]/20">
                  Reason: Budget constraints for Q4. Follow up in Q1 next year.
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div className="flex -space-x-2">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfY_iTLDRJ8_LYINrqGTiEmIe4PMGprxQHk8GHlz-GvNUMHueudhzWPIAo4_zYkMjvCxYwFot81Sab-2WBdVbLC1dFI1Bi3PDQJERHF-lrcwx8SyAkSGZjExINzqBW7YlLn5554vqeKHaP5-6TYxLNdzu8zqsIQQMx66TX69-2N2PTu-DAtVORZ-RCyzdkyP-eF1YV_eyEXgEJecQqK1lQ6QT9kunHoZDCrjXIwcoN7xF1Z_IrXGOw4V0-rxemhN01-EUZFaMi6_Y"
                      alt="Agent"
                      className="w-6 h-6 rounded-full border border-[#1d1d33] z-10"
                    />
                  </div>
                  <span className="text-xs font-medium text-[#aba9bf] flex items-center gap-1">
                    <Archive className="w-3 h-3" /> Archived
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
