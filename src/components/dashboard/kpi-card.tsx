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
      className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 rounded-2xl glass-panel"
    >
      {/* Intense Hover Glow Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `0 0 40px ${glowColor} inset` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Ambient Orb */}
      <div
        className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150"
        style={{ background: orbColor, opacity: 0.15 }}
      />

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div
            className="p-3 rounded-xl bg-white/50 border border-white/60 group-hover:scale-110 transition-transform duration-300 shadow-sm backdrop-blur-sm"
          >
            <Icon className="w-6 h-6" style={{ color: iconColor, filter: `drop-shadow(0 0 10px ${iconColor})` }} />
          </div>
          <span
            className={`flex items-center text-xs font-medium ${
              trendDirection === "up"
                ? "text-emerald-500"
                : trendDirection === "down"
                ? "text-destructive"
                : "text-muted-foreground"
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

        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">{title}</p>
        <h3 className="font-heading text-3xl font-extrabold tracking-tight text-foreground transition-all duration-300 drop-shadow-sm">
          {value}
          {valueSuffix && (
            <span className="text-lg text-muted-foreground font-medium ml-1">
              {valueSuffix}
            </span>
          )}
        </h3>
      </div>
    </motion.div>
  );
}
