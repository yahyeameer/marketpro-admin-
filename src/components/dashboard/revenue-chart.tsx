"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const yLabels = ["$150k", "$100k", "$50k", "$0"];

// Revenue data points (normalized 0-200 for SVG viewBox)
const dataPoints = [
  { x: 0, y: 100 },
  { x: 167, y: 110 },
  { x: 333, y: 80 },
  { x: 500, y: 140 },
  { x: 667, y: 120 },
  { x: 833, y: 60 },
  { x: 1000, y: 30 },
];

const linePath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
const areaPath = `${linePath} L1000,200 L0,200 Z`;

const timeRanges = ["1M", "3M", "1Y"];

export function RevenueChart() {
  const [activeRange, setActiveRange] = useState("1M");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-[#474659]/20 bg-white/[0.06] backdrop-blur-[32px] p-6 md:p-8"
      style={{ boxShadow: "0 0 60px rgba(138, 76, 252, 0.08)" }}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#e6e3fb]">
            Monthly Revenue Trend
          </h2>
          <p className="text-sm text-[#aba9bf] mt-1">
            Real-time aggregation across all regions.
          </p>
        </div>
        <div className="flex p-1 rounded-lg border border-[#474659]/15 bg-white/[0.03] backdrop-blur-[32px]">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeRange === range
                  ? "bg-white/10 text-[#e6e3fb]"
                  : "text-[#aba9bf] hover:text-[#e6e3fb]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full relative">
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#aba9bf] font-mono py-2">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute left-12 right-0 top-0 h-full flex flex-col justify-between py-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-px bg-[#474659]/10" />
          ))}
        </div>

        {/* SVG Chart */}
        <div className="absolute left-12 right-0 top-0 h-full pb-8">
          <svg
            className="overflow-visible"
            width="100%"
            height="100%"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#53ddfc" stopOpacity="1" />
                <stop offset="100%" stopColor="#53ddfc" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Gradient fill area */}
            <path d={areaPath} fill="url(#chart-gradient)" opacity="0.3" />
            {/* Neon line */}
            <path
              d={linePath}
              fill="none"
              stroke="#53ddfc"
              strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 8px #53ddfc)" }}
            />
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-[#aba9bf] font-mono">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
