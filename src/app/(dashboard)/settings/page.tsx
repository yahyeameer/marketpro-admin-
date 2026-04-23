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
  UserCog,
  Palette,
  Check,
  X
} from "lucide-react";
import { useActivityLog, type ActivityEntry } from "@/lib/hooks/use-activity-log";
import { useCustomRoles } from "@/lib/hooks/use-custom-roles";

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

function RoleManager() {
  const { roles, addRole, deleteRole } = useCustomRoles();
  const [isCreating, setIsCreating] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", colorId: "purple" });
  const [newPerms, setNewPerms] = useState<Record<string, boolean>>({
    dashboard: true, visits: false, sales: false, leads: false, employees: false, reports: false, users: false, settings: false
  });

  const colors = [
    { id: "purple", value: "bg-[#bd9dff]/10 text-[#bd9dff] border-[#bd9dff]/20" },
    { id: "cyan", value: "bg-[#53ddfc]/10 text-[#53ddfc] border-[#53ddfc]/20" },
    { id: "pink", value: "bg-[#ff6daf]/10 text-[#ff6daf] border-[#ff6daf]/20" },
    { id: "green", value: "bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20" },
  ];

  const permKeys = ["dashboard", "visits", "sales", "leads", "employees", "reports", "users", "settings"];

  const handleSave = () => {
    if (!newRole.name) return;
    addRole({
      id: newRole.name.toLowerCase().replace(/\s+/g, '-'),
      name: newRole.name,
      color: colors.find(c => c.id === newRole.colorId)?.value || colors[0].value,
      permissions: newPerms
    });
    setIsCreating(false);
    setNewRole({ name: "", colorId: "purple" });
    setNewPerms({ dashboard: true, visits: false, sales: false, leads: false, employees: false, reports: false, users: false, settings: false });
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold text-[#e6e3fb] flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#bd9dff]/10">
            <UserCog className="w-5 h-5 text-[#bd9dff]" />
          </div>
          Role & Permissions Configurator
        </h2>
        <button onClick={() => setIsCreating(!isCreating)} className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-[#0c0c1d] px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(189,157,255,0.4)] flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-5 hover:bg-white/5 transition-colors group relative shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#bd9dff]/5 rounded-full blur-2xl group-hover:bg-[#bd9dff]/10 transition-all pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${role.color}`}>
                {role.name}
              </span>
              {role.id !== 'admin' && role.id !== 'manager' && (
                <button onClick={() => deleteRole(role.id)} className="text-[#aba9bf] hover:text-[#ff6e84] opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/5 rounded-md hover:bg-[#ff6e84]/20">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 relative z-10">
              {Object.entries(role.permissions).filter(([_, v]) => v).map(([k]) => (
                <span key={k} className="text-[10px] bg-[#23233b] text-[#aba9bf] px-2 py-0.5 rounded-full border border-[#474659]/20 capitalize">
                  {k}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCreating && (
        <motion.div initial={{ opacity: 0, height: 0, scale: 0.98 }} animate={{ opacity: 1, height: "auto", scale: 1 }} className="bg-[#111124]/70 backdrop-blur-xl border border-[#bd9dff]/30 rounded-xl p-6 overflow-hidden relative shadow-[0_0_40px_rgba(189,157,255,0.1)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#bd9dff]/10 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-[#aba9bf] mb-1.5 block">Custom Role Name</label>
                <input value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} type="text" placeholder="e.g. Sales Coordinator" className="w-full bg-[#0c0c1d] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#aba9bf] mb-2 flex items-center gap-1"><Palette className="w-3.5 h-3.5" /> Badge Appearance</label>
                <div className="flex gap-3">
                  {colors.map(c => (
                    <button key={c.id} onClick={() => setNewRole({...newRole, colorId: c.id})} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${c.value.split(' ')[0].replace('/10', '/30')} ${newRole.colorId === c.id ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}>
                      {newRole.colorId === c.id && <Check className="w-5 h-5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-[#aba9bf] mb-3 block">Resource Access (What they can see)</label>
              <div className="grid grid-cols-2 gap-3 bg-[#0c0c1d]/50 p-4 rounded-xl border border-white/5">
                {permKeys.map(k => (
                  <label key={k} className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newPerms[k] ? 'bg-[#bd9dff] border-[#bd9dff]' : 'bg-[#0c0c1d] border-[#474659]/50 group-hover:border-[#bd9dff]/50'}`}>
                      {newPerms[k] && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm capitalize transition-colors ${newPerms[k] ? 'text-[#e6e3fb] font-medium' : 'text-[#aba9bf] group-hover:text-[#e6e3fb]'}`}>{k}</span>
                    <input type="checkbox" className="hidden" checked={newPerms[k]} onChange={(e) => setNewPerms({...newPerms, [k]: e.target.checked})} disabled={k === 'dashboard'} />
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 relative z-10 border-t border-white/5 pt-5">
            <button onClick={() => setIsCreating(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#e6e3fb] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">Cancel</button>
            <button onClick={handleSave} className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-8 py-2.5 rounded-lg text-sm font-bold text-[#0c0c1d] hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all flex items-center gap-2">
              Generate Role
            </button>
          </div>
        </motion.div>
      )}
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

        <RoleManager />

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
