"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Shield,
  Activity,
  Filter,
  User,
  ArrowRightLeft,
  Eye,
  EyeOff,
  Plus,
  ShoppingCart,
  MapPin,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useActivityLog, type ActivityEntry } from "@/lib/hooks/use-activity-log";

const actionConfig: Record<string, { icon: typeof Activity; color: string; label: string }> = {
  granted_access: { icon: Eye, color: "text-[#4ade80]", label: "Granted Access" },
  revoked_access: { icon: EyeOff, color: "text-[#ff6e84]", label: "Revoked Access" },
  created_user: { icon: Plus, color: "text-[#53ddfc]", label: "Created User" },
  created_lead: { icon: FileText, color: "text-[#bd9dff]", label: "Created Lead" },
  created_sale: { icon: ShoppingCart, color: "text-[#ff6daf]", label: "Recorded Sale" },
  created_visit: { icon: MapPin, color: "text-[#53ddfc]", label: "Logged Visit" },
};

const filterOptions = [
  { value: "", label: "All Activity" },
  { value: "permission", label: "Permissions" },
  { value: "lead", label: "Leads" },
  { value: "sale", label: "Sales" },
  { value: "visit", label: "Visits" },
  { value: "user", label: "Users" },
];

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const config = actionConfig[entry.action] || {
    icon: Activity,
    color: "text-[#aba9bf]",
    label: entry.action.replace(/_/g, " "),
  };
  const Icon = config.icon;
  const meta = entry.metadata as Record<string, string>;

  let description = config.label;
  if (entry.action === "granted_access" || entry.action === "revoked_access") {
    description = `${config.label} to ${meta.page || "a page"}`;
  }

  return (
    <div className="flex gap-4 group">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-lg bg-white/[0.05] border border-[#474659]/20 ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-px flex-1 bg-[#474659]/20 mt-2 group-last:hidden" />
      </div>

      {/* Content */}
      <div className="pb-8 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-[#e6e3fb] font-medium">
              {description}
            </p>
            <p className="text-xs text-[#aba9bf] mt-0.5">
              by <span className="text-[#bd9dff] font-medium">{entry.user_name}</span>
            </p>
          </div>
          <span className="text-[10px] text-[#aba9bf]/70 font-mono whitespace-nowrap shrink-0">
            {formatTimestamp(entry.created_at)}
          </span>
        </div>

        {/* Metadata chips */}
        {Object.keys(meta).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(meta)
              .filter(([key]) => key !== "old_value" && key !== "new_value")
              .slice(0, 3)
              .map(([key, value]) => (
                <span
                  key={key}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[#23233b] text-[#aba9bf] border border-[#474659]/20 font-mono"
                >
                  {key}: {String(value).substring(0, 20)}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [entityFilter, setEntityFilter] = useState("");
  const { entries, loading, hasMore, loadMore } = useActivityLog({
    entityType: entityFilter || undefined,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10"
    >
      {/* Liquid Light Orbs */}
      <div
        className="fixed top-[10%] right-[5%] w-[40vw] h-[40vw] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(189, 157, 255, 0.12) 0%, rgba(12, 12, 29, 0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#e6e3fb] mb-2">
              Settings
            </h1>
            <p className="text-[#aba9bf] text-sm max-w-lg">
              System configuration and activity audit log for the MarketPro platform.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-[#bd9dff]/10">
              <Shield className="w-5 h-5 text-[#bd9dff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e6e3fb] font-mono">{entries.length}</p>
              <p className="text-xs text-[#aba9bf]">Total Events</p>
            </div>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-[#53ddfc]/10">
              <ArrowRightLeft className="w-5 h-5 text-[#53ddfc]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e6e3fb] font-mono">
                {entries.filter((e) => e.entity_type === "permission").length}
              </p>
              <p className="text-xs text-[#aba9bf]">Permission Changes</p>
            </div>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-[#ff6daf]/10">
              <User className="w-5 h-5 text-[#ff6daf]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e6e3fb] font-mono">
                {new Set(entries.map((e) => e.user_id)).size}
              </p>
              <p className="text-xs text-[#aba9bf]">Active Users</p>
            </div>
          </div>
        </div>

        {/* Audit Log Panel */}
        <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl overflow-hidden shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
          {/* Filter Header */}
          <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111124]/50">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#bd9dff]" />
              <h2 className="font-heading text-lg font-bold text-[#e6e3fb]">
                Activity Audit Log
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aba9bf]" />
                <select
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="bg-[#111124] border border-[#474659]/30 rounded-lg pl-9 pr-8 py-2 text-sm text-[#e6e3fb] appearance-none cursor-pointer focus:outline-none focus:border-[#53ddfc]/50 transition-colors"
                >
                  {filterOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aba9bf] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-8 h-8 border-2 border-[#bd9dff]/30 border-t-[#bd9dff] rounded-full animate-spin mb-4" />
                <p className="text-sm text-[#aba9bf]">Loading activity...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="p-4 rounded-full bg-[#23233b] mb-4">
                  <Activity className="w-8 h-8 text-[#aba9bf]/50" />
                </div>
                <p className="text-sm text-[#aba9bf] font-medium">
                  No activity yet
                </p>
                <p className="text-xs text-[#aba9bf]/60 mt-1">
                  Actions will appear here as they happen
                </p>
              </div>
            ) : (
              <>
                {entries.map((entry) => (
                  <ActivityItem key={entry.id} entry={entry} />
                ))}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={loadMore}
                      className="px-6 py-2.5 rounded-lg text-sm font-medium text-[#bd9dff] border border-[#bd9dff]/20 hover:bg-[#bd9dff]/10 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
