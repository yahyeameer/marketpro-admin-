"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  BarChart2,
  FileText,
  Download,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const topPerformers = [
  { name: "S. Connor", value: "142k", percentage: 95, color: "bg-[#bd9dff]" },
  { name: "J. Reese", value: "118k", percentage: 80, color: "bg-[#bd9dff]/80" },
  { name: "M. Dyson", value: "95k", percentage: 65, color: "bg-[#bd9dff]/60" },
  { name: "T. Weaver", value: "88k", percentage: 55, color: "bg-[#bd9dff]/40" },
  { name: "K. Brewster", value: "72k", percentage: 40, color: "bg-[#bd9dff]/20" },
];

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 lg:p-8 xl:p-10 relative z-10"
    >
      {/* Liquid Light Orbs */}
      <div
        className="fixed top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(64, 206, 237, 0.15) 0%, rgba(12, 12, 29, 0) 70%)",
        }}
      />
      <div
        className="fixed bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 83, 164, 0.12) 0%, rgba(12, 12, 29, 0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-[#e6e3fb] tracking-tight mb-2">
              Performance Reports
            </h2>
            <p className="font-body text-sm text-[#aba9bf] max-w-xl">
              Generate and analyze comprehensive data across sales, field activity,
              and employee performance metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 p-2 rounded-xl shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="flex items-center bg-[#111124] border border-[#474659]/30 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-[#aba9bf] mr-2" />
              <span className="font-medium text-sm text-[#e6e3fb]">
                Oct 01 - Oct 31, 2023
              </span>
              <ChevronDown className="w-4 h-4 text-[#aba9bf] ml-2" />
            </div>
            <button className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-4 py-2 rounded-lg font-medium text-sm text-black flex items-center gap-2 hover:shadow-[0_0_15px_rgba(189,157,255,0.4)] transition-all">
              <BarChart2 className="w-4 h-4" />
              Generate Report
            </button>
            <div className="h-8 w-px bg-[#474659]/30 mx-1"></div>
            <button className="bg-white/5 border border-[#474659]/20 hover:bg-white/10 text-[#e6e3fb] text-xs font-medium px-3 py-2 rounded-full flex items-center gap-1 transition-colors">
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button className="bg-white/5 border border-[#474659]/20 hover:bg-white/10 text-[#e6e3fb] text-xs font-medium px-3 py-2 rounded-full flex items-center gap-1 transition-colors">
              <Download className="w-4 h-4" /> CSV
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Full Width Area Chart: Revenue Trend */}
          <div className="lg:col-span-12 bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            {/* Ambient Orb for Chart */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#40ceed]/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#e6e3fb]">
                  Revenue Trend
                </h3>
                <p className="font-body text-xs text-[#aba9bf] mt-1">
                  Monthly aggregate vs target
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold tracking-tight text-[#e6e3fb] font-mono">
                  $1.42M
                </span>
                <span className="font-medium text-xs text-[#53ddfc] bg-[#40ceed]/10 px-2 py-0.5 rounded-full flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> 14.2%
                </span>
              </div>
            </div>

            {/* Chart Visualization Mock */}
            <div className="h-64 w-full relative flex items-end">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-[#474659]/20 pb-6 pl-2">
                <div className="w-full border-t border-[#474659]/10 h-0 relative">
                  <span className="absolute -left-10 -top-2 text-[10px] text-[#aba9bf] font-mono">
                    1.5M
                  </span>
                </div>
                <div className="w-full border-t border-[#474659]/10 h-0 relative">
                  <span className="absolute -left-10 -top-2 text-[10px] text-[#aba9bf] font-mono">
                    1.0M
                  </span>
                </div>
                <div className="w-full border-t border-[#474659]/10 h-0 relative">
                  <span className="absolute -left-10 -top-2 text-[10px] text-[#aba9bf] font-mono">
                    0.5M
                  </span>
                </div>
                <div className="w-full h-0 relative">
                  <span className="absolute -left-8 -top-2 text-[10px] text-[#aba9bf] font-mono">
                    0
                  </span>
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="absolute bottom-0 left-2 right-0 flex justify-between text-[10px] text-[#aba9bf] font-mono pt-2">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
              </div>

              {/* Area Fill Mock (CSS Gradient Polygon) */}
              <div className="relative w-full h-[calc(100%-24px)] ml-2 flex items-end overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 w-full h-full"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(189, 157, 255, 0.2), transparent)",
                    clipPath:
                      "polygon(0 80%, 20% 60%, 40% 70%, 60% 40%, 80% 30%, 100% 10%, 100% 100%, 0 100%)",
                  }}
                />
                {/* Line Path Mock */}
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M0,80 L20,60 L40,70 L60,40 L80,30 L100,10"
                    fill="none"
                    stroke="#bd9dff"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Glow effect */}
                  <path
                    d="M0,80 L20,60 L40,70 L60,40 L80,30 L100,10"
                    fill="none"
                    filter="blur(4px)"
                    stroke="#bd9dff"
                    strokeOpacity="0.3"
                    strokeWidth="6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Data Points */}
                {[
                  { x: "0%", y: "20%" },
                  { x: "20%", y: "40%" },
                  { x: "40%", y: "30%" },
                  { x: "60%", y: "60%" },
                  { x: "80%", y: "70%" },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-[#0c0c1d] border border-[#bd9dff] z-10"
                    style={{
                      left: pos.x,
                      bottom: pos.y,
                      transform: "translate(-50%, 50%)",
                    }}
                  />
                ))}
                <div
                  className="absolute w-3 h-3 rounded-full bg-[#ff6daf] border-2 border-[#0c0c1d] z-10 shadow-[0_0_10px_rgba(255,109,175,0.8)]"
                  style={{
                    left: "100%",
                    bottom: "90%",
                    transform: "translate(-50%, 50%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Heatmap Grid: Field Visits */}
          <div className="lg:col-span-8 bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 flex flex-col shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#e6e3fb]">
                  Visit Intensity Heatmap
                </h3>
                <p className="font-body text-xs text-[#aba9bf] mt-1">
                  Activity by day and time
                </p>
              </div>
              <button className="text-xs text-[#bd9dff] hover:text-[#8a4cfc] font-medium flex items-center">
                View Details <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            {/* Heatmap area placeholder (simplified visual abstraction) */}
            <div className="flex-1 grid grid-cols-8 gap-1 h-[200px]">
              <div className="col-span-1 flex flex-col justify-around text-[10px] text-[#aba9bf] font-medium pr-2 text-right">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
              <div className="col-span-7 grid grid-cols-12 grid-rows-7 gap-1">
                <div className="col-span-12 flex justify-between text-[9px] text-[#aba9bf]/70 font-mono mb-1 px-1">
                  <span>8A</span>
                  <span>12P</span>
                  <span>4P</span>
                  <span>8P</span>
                </div>
                {/* Randomly generate 7 * 12 = 84 cells for aesthetic purposes */}
                {Array.from({ length: 84 }).map((_, i) => {
                  // Generate some pseudo-random distribution
                  const intensity = Math.sin(i / 10) * Math.cos(i / 3);
                  let bgClass = "bg-[#111124]"; // Low

                  if (intensity > 0.8) bgClass = "bg-[#ff6daf]/80"; // Highest
                  else if (intensity > 0.4) bgClass = "bg-[#40ceed]/90"; // High
                  else if (intensity > 0) bgClass = "bg-[#40ceed]/50"; // Med
                  else if (intensity > -0.4) bgClass = "bg-[#40ceed]/20"; // Med-Low

                  return <div key={i} className={`${bgClass} rounded-sm`} />;
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-[#aba9bf] font-medium">
              <span>Low</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 bg-[#111124] rounded-sm" />
                <div className="w-3 h-3 bg-[#40ceed]/30 rounded-sm" />
                <div className="w-3 h-3 bg-[#40ceed]/60 rounded-sm" />
                <div className="w-3 h-3 bg-[#40ceed]/90 rounded-sm" />
                <div className="w-3 h-3 bg-[#ff6daf]/80 rounded-sm" />
              </div>
              <span>High</span>
            </div>
          </div>

          {/* Donut Chart & Top 5 Column Stack */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Donut Chart: Sales by Service Type */}
            <div className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
              {/* Ambient Orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#fa53a4]/10 rounded-full blur-[40px] pointer-events-none" />
              <h3 className="font-heading text-md font-bold text-[#e6e3fb] mb-4">
                Sales by Category
              </h3>
              <div className="flex items-center justify-center relative my-4">
                {/* CSS Donut Mock */}
                <div
                  className="w-32 h-32 rounded-full relative"
                  style={{
                    background:
                      "conic-gradient(#bd9dff 0% 45%, #40ceed 45% 75%, #ff6daf 75% 90%, #23233b 90% 100%)",
                  }}
                >
                  <div className="absolute inset-4 bg-[#0c0c1d] rounded-full flex items-center justify-center flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                    <span className="font-mono text-sm font-bold text-[#e6e3fb]">
                      2.4k
                    </span>
                    <span className="text-[9px] text-[#aba9bf]">Units</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#bd9dff]" />
                    <span className="font-medium text-[#e6e3fb]">Consulting</span>
                  </div>
                  <span className="font-mono text-[#aba9bf]">45%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#40ceed]" />
                    <span className="font-medium text-[#e6e3fb]">Hardware</span>
                  </div>
                  <span className="font-mono text-[#aba9bf]">30%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ff6daf]" />
                    <span className="font-medium text-[#e6e3fb]">Software</span>
                  </div>
                  <span className="font-mono text-[#aba9bf]">15%</span>
                </div>
              </div>
            </div>

            {/* Bar Chart: Top 5 Employees */}
            <div className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 flex-1 shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
              <h3 className="font-heading text-md font-bold text-[#e6e3fb] mb-4">
                Top Performers
              </h3>
              <div className="space-y-4">
                {topPerformers.map((emp, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-[#e6e3fb]">
                        {emp.name}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          i === 0 ? "text-[#bd9dff]" : "text-[#aba9bf]"
                        }`}
                      >
                        {emp.value}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#23233b] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${emp.color} rounded-full`}
                        style={{ width: `${emp.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
