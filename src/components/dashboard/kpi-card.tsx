"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  valueSuffix?: string;
  icon: LucideIcon;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  glowColor: string;
  orbColor: string;
  iconColor: string;
}

export function KpiCard({
  title,
  value,
  valueSuffix,
  icon: Icon,
  trend,
  trendDirection,
  glowColor,
  orbColor,
  iconColor,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 rounded-xl border border-[#474659]/15 bg-white/[0.03] backdrop-blur-[32px]"
      style={{ boxShadow: `0 0 60px ${glowColor}` }}
    >
      {/* Ambient Orb */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-colors"
        style={{ background: `${orbColor}10` }}
      />

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div
            className="p-2 rounded-lg bg-[#1d1d33] border border-[#474659]/20"
            style={{ boxShadow: `0 0 40px ${glowColor}` }}
          >
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
          </div>
          <span
            className={`flex items-center text-xs font-medium ${
              trendDirection === "up"
                ? "text-[#65e1ff]"
                : trendDirection === "down"
                ? "text-[#ff6e84]"
                : "text-[#aba9bf]"
            }`}
          >
            {trendDirection === "up" && (
              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l5-5 5 5M7 7l5 5 5-5" />
              </svg>
            )}
            {trendDirection === "down" && (
              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 7l5 5 5-5M7 17l5-5 5 5" />
              </svg>
            )}
            {trendDirection === "neutral" && (
              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
              </svg>
            )}
            {trend}
          </span>
        </div>

        <p className="text-sm text-[#aba9bf] mb-1">{title}</p>
        <h3 className="font-heading text-3xl font-bold tracking-tight text-[#e6e3fb]">
          {value}
          {valueSuffix && (
            <span className="text-lg text-[#aba9bf] font-medium">
              {valueSuffix}
            </span>
          )}
        </h3>
      </div>
    </motion.div>
  );
}
