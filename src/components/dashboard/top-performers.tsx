"use client";

import { motion } from "framer-motion";
import { ArrowUp, Minus } from "lucide-react";

const performers = [
  {
    name: "Sarah Jenkins",
    role: "Senior Rep",
    region: "Northwest",
    visits: 142,
    revenue: "$18.4k",
    trend: "up" as const,
    ringColor: "ring-[#bd9dff]/20",
    avatarGradient: "from-[#bd9dff] to-[#8a4cfc]",
    initials: "SJ",
  },
  {
    name: "Marcus Chen",
    role: "Field Agent",
    region: "East Coast",
    visits: 128,
    revenue: "$16.2k",
    trend: "up" as const,
    ringColor: "ring-[#ff6daf]/20",
    avatarGradient: "from-[#ff6daf] to-[#fa53a4]",
    initials: "MC",
  },
  {
    name: "Elena Rodriguez",
    role: "Field Agent",
    region: "Southwest",
    visits: 115,
    revenue: "$14.9k",
    trend: "neutral" as const,
    ringColor: "ring-[#757388]/20",
    avatarGradient: "from-[#53ddfc] to-[#40ceed]",
    initials: "ER",
  },
];

export function TopPerformers() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-xl border border-[#474659]/15 bg-white/[0.03] backdrop-blur-[32px] p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-lg font-bold text-[#e6e3fb]">
          Top Performers
        </h2>
        <button className="text-sm font-medium text-[#bd9dff] hover:text-[#b28cff] transition-colors">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-[#aba9bf] border-b border-[#474659]/20 uppercase tracking-wider">
              <th className="pb-3 font-medium px-4">Agent</th>
              <th className="pb-3 font-medium px-4">Region</th>
              <th className="pb-3 font-medium px-4 text-right">Visits</th>
              <th className="pb-3 font-medium px-4 text-right">Revenue</th>
              <th className="pb-3 font-medium pl-4 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {performers.map((p, i) => (
              <tr
                key={p.name}
                className={`hover:bg-white/5 transition-colors group ${
                  i < performers.length - 1
                    ? "border-b border-[#474659]/10"
                    : ""
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.avatarGradient} ring-2 ${p.ringColor} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {p.initials}
                    </div>
                    <div>
                      <p className="font-medium text-[#e6e3fb]">{p.name}</p>
                      <p className="text-xs text-[#aba9bf]">{p.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#aba9bf]">{p.region}</td>
                <td className="py-3 px-4 text-right font-mono text-[#e6e3fb]">
                  {p.visits}
                </td>
                <td className="py-3 px-4 text-right font-mono font-medium text-[#e6e3fb]">
                  {p.revenue}
                </td>
                <td className="py-3 pl-4 text-center">
                  {p.trend === "up" ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#53ddfc]/10 text-[#53ddfc]">
                      <ArrowUp className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#474659]/30 text-[#aba9bf]">
                      <Minus className="w-4 h-4" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
