"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function RevenueChart() {
  const [activeRange, setActiveRange] = useState("All");
  const [chartData, setChartData] = useState<{ month: string; revenue: number }[]>([]);
  const [maxRev, setMaxRev] = useState(1);

  useEffect(() => {
    async function fetchRevenue() {
      const supabase = createClient();
      const { data } = await supabase
        .from("sales")
        .select("price, sale_date")
        .order("sale_date", { ascending: true });

      if (data && data.length > 0) {
        // Group by month
        const monthMap = new Map<string, number>();
        data.forEach((s: any) => {
          const d = new Date(s.sale_date);
          const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          monthMap.set(key, (monthMap.get(key) || 0) + Number(s.price || 0));
        });

        const entries = Array.from(monthMap.entries()).map(([month, revenue]) => ({
          month,
          revenue,
        }));
        setChartData(entries);
        setMaxRev(Math.max(...entries.map((e) => e.revenue), 1));
      }
    }
    fetchRevenue();
  }, []);

  const timeRanges = ["All", "3M", "1M"];

  // Build SVG path from real data
  const points = chartData.map((d, i) => ({
    x: chartData.length > 1 ? (i / (chartData.length - 1)) * 1000 : 500,
    y: 200 - (d.revenue / maxRev) * 180,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = points.length > 0 ? `${linePath} L1000,200 L0,200 Z` : "";

  const yMax = maxRev;
  const yLabels = [
    `$${(yMax / 1000).toFixed(0)}k`,
    `$${((yMax * 0.66) / 1000).toFixed(0)}k`,
    `$${((yMax * 0.33) / 1000).toFixed(0)}k`,
    "$0",
  ];

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
            Real-time aggregation across all sales.
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
          {chartData.length > 0 ? (
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
              <path d={areaPath} fill="url(#chart-gradient)" opacity="0.3" />
              <path
                d={linePath}
                fill="none"
                stroke="#53ddfc"
                strokeWidth="3"
                style={{ filter: "drop-shadow(0 0 8px #53ddfc)" }}
              />
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-[#aba9bf]">
              <div className="w-5 h-5 border-2 border-[#53ddfc]/30 border-t-[#53ddfc] rounded-full animate-spin mr-3" />
              Loading chart data...
            </div>
          )}
        </div>

        {/* X Axis Labels */}
        <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-[#aba9bf] font-mono">
          {chartData.map((d) => (
            <span key={d.month}>{d.month}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
