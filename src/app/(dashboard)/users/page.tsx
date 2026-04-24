"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Radar,
  Hourglass,
  MoreVertical,
  Edit2,
  Trash2,
  TrendingUp,
  X,
  Mail,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  EyeOff,
  MapPin,
  CreditCard,
  UserPlus,
  BadgeCheck,
  FileBarChart,
  UserCog,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/components/providers/user-provider";
import { logActivity } from "@/lib/utils/log-activity";
import { useCustomRoles } from "@/lib/hooks/use-custom-roles";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Permission {
  id: string;
  page_slug: string;
  is_visible: boolean;
}

// roleConfig is now dynamic based on custom roles hook, so we remove the static one

const pageConfig = [
  { slug: "/dashboard", label: "Dashboard", icon: LayoutDashboard, locked: true },
  { slug: "/visits", label: "Field Visits", icon: MapPin, locked: false },
  { slug: "/sales", label: "Sales", icon: CreditCard, locked: false },
  { slug: "/leads", label: "Leads", icon: UserPlus, locked: false },
  { slug: "/employees", label: "Employees", icon: BadgeCheck, locked: false },
  { slug: "/reports", label: "Reports", icon: FileBarChart, locked: false },
  { slug: "/users", label: "User Mgmt", icon: UserCog, locked: false },
  { slug: "/settings", label: "Settings", icon: Settings, locked: false },
];

function PermissionModal({
  targetUser,
  onClose,
  currentUserId,
}: {
  targetUser: UserRow;
  onClose: () => void;
  currentUserId: string;
}) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_permissions")
      .select("id, page_slug, is_visible")
      .eq("user_id", targetUser.id);
    if (data) setPermissions(data);
    setLoading(false);
  }, [targetUser.id]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const togglePermission = async (pageSlug: string) => {
    const perm = permissions.find((p) => p.page_slug === pageSlug);
    if (!perm) return;

    const newValue = !perm.is_visible;
    setSaving(pageSlug);

    // Optimistic update
    setPermissions((prev) =>
      prev.map((p) =>
        p.page_slug === pageSlug ? { ...p, is_visible: newValue } : p
      )
    );

    const supabase = createClient();
    await supabase
      .from("user_permissions")
      .update({ is_visible: newValue })
      .eq("id", perm.id);

    // Log activity
    await logActivity(
      currentUserId,
      newValue ? "granted_access" : "revoked_access",
      "permission",
      perm.id,
      { page: pageSlug, target_user: targetUser.name, visible: newValue }
    );

    setSaving(null);
  };

  const isVisible = (slug: string) => {
    const perm = permissions.find((p) => p.page_slug === slug);
    return perm?.is_visible ?? true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1d]/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(189,157,255,0.08)] relative bg-[#18182b] border border-[#474659]/30"
      >
        {/* Modal Orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#bd9dff]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#bd9dff]/10">
              <Shield className="w-5 h-5 text-[#bd9dff]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#e6e3fb]">
                Page Permissions
              </h3>
              <p className="text-xs text-[#aba9bf]">
                {targetUser.name} — {targetUser.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#aba9bf] hover:text-[#e6e3fb] transition-colors p-1 rounded-full hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Grid */}
        <div className="p-6 space-y-3 relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#bd9dff]/30 border-t-[#bd9dff] rounded-full animate-spin" />
            </div>
          ) : (
            pageConfig.map((page) => {
              const Icon = page.icon;
              const visible = isVisible(page.slug);
              const isSaving = saving === page.slug;

              return (
                <div
                  key={page.slug}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                    visible
                      ? "bg-white/[0.03] border-[#474659]/20"
                      : "bg-[#ff6e84]/5 border-[#ff6e84]/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        visible ? "text-[#bd9dff]" : "text-[#aba9bf]/50"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        visible ? "text-[#e6e3fb]" : "text-[#aba9bf]/60 line-through"
                      }`}
                    >
                      {page.label}
                    </span>
                    {page.locked && (
                      <span className="text-[9px] text-[#53ddfc] bg-[#53ddfc]/10 px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider">
                        Required
                      </span>
                    )}
                  </div>

                  {page.locked ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#aba9bf]/60">
                      <Eye className="w-3.5 h-3.5" />
                      Always On
                    </div>
                  ) : (
                    <button
                      onClick={() => togglePermission(page.slug)}
                      disabled={isSaving}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                        visible
                          ? "bg-[#bd9dff]/30 border border-[#bd9dff]/40"
                          : "bg-[#23233b] border border-[#474659]/30"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
                          visible
                            ? "left-[22px] bg-[#bd9dff] shadow-[0_0_8px_rgba(189,157,255,0.5)]"
                            : "left-0.5 bg-[#474659]"
                        }`}
                      >
                        {isSaving ? (
                          <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
                        ) : visible ? (
                          <Eye className="w-3 h-3 text-white" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-[#aba9bf]" />
                        )}
                      </div>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-end bg-[#000000]/30 relative z-10">
          <button
            onClick={onClose}
            className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0c0c1d] hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UsersPage() {
  const { user: currentUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permTarget, setPermTarget] = useState<UserRow | null>(null);
  const [usersData, setUsersData] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { roles } = useCustomRoles();

  useEffect(() => {
    async function fetchUsers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select("id, name, email, role, created_at")
        .order("created_at", { ascending: true });
      if (data) setUsersData(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 flex flex-col min-h-[calc(100vh-64px)]"
    >
      {/* Liquid Light Orbs */}
      <div
        className="fixed top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[60px] will-change-transform transform-gpu"
        style={{
          background:
            "radial-gradient(circle, rgba(64, 206, 237, 0.15) 0%, rgba(64, 206, 237, 0) 70%)",
        }}
      />
      <div
        className="fixed bottom-[-200px] left-[100px] w-[800px] h-[800px] rounded-full pointer-events-none z-0 blur-[60px] will-change-transform transform-gpu"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 83, 164, 0.1) 0%, rgba(250, 83, 164, 0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 shrink-0">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight mb-2 text-[#e6e3fb]">
              User Management
            </h1>
            <p className="text-[#aba9bf] text-sm max-w-lg">
              Manage access controls, assign roles, and monitor active sessions
              across the MarketPro ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => alert("Filter drawer opening...")} className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors text-[#e6e3fb]">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0c0c1d] flex items-center gap-2 hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Metric Cards Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 shrink-0">
          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#bd9dff]/10 rounded-full blur-2xl group-hover:bg-[#bd9dff]/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#aba9bf] text-sm font-medium">Total Users</span>
              <span className="text-[#bd9dff]/70 bg-[#bd9dff]/10 p-1.5 rounded-md">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="font-heading text-3xl font-bold tracking-tight text-[#e6e3fb] font-mono">
              {usersData.length}
            </div>
            <div className="mt-2 text-xs text-[#53ddfc] flex items-center font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live count
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#53ddfc]/10 rounded-full blur-2xl group-hover:bg-[#53ddfc]/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#aba9bf] text-sm font-medium">Admins</span>
              <span className="text-[#53ddfc]/70 bg-[#53ddfc]/10 p-1.5 rounded-md">
                <Radar className="w-4 h-4" />
              </span>
            </div>
            <div className="font-heading text-3xl font-bold tracking-tight text-[#e6e3fb] font-mono">
              {usersData.filter((u) => u.role === "admin").length}
            </div>
            <div className="mt-2 text-xs text-[#aba9bf] flex items-center font-medium">
              Full access users
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#ff6e84]/10 rounded-full blur-2xl group-hover:bg-[#ff6e84]/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#aba9bf] text-sm font-medium">Managers</span>
              <span className="text-[#ff6e84]/70 bg-[#ff6e84]/10 p-1.5 rounded-md">
                <Hourglass className="w-4 h-4" />
              </span>
            </div>
            <div className="font-heading text-3xl font-bold tracking-tight text-[#e6e3fb] font-mono">
              {usersData.filter((u) => u.role === "manager").length}
            </div>
            <div className="mt-2 text-xs text-[#aba9bf] flex items-center font-medium">
              Limited access users
            </div>
          </div>
        </div>

        {/* Users Table Container */}
        <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl flex-1 flex flex-col overflow-hidden relative shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#111124]/50">
            <h2 className="font-heading text-lg font-semibold text-[#e6e3fb]">
              Directory
            </h2>
            <button onClick={() => alert("Opening directory options...")} className="text-[#aba9bf] hover:text-[#e6e3fb] p-1 rounded transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs text-[#aba9bf] uppercase tracking-wider bg-[#111124]/30">
                  <th className="py-4 px-6 font-medium">User</th>
                  <th className="py-4 px-6 font-medium">Role</th>
                  <th className="py-4 px-6 font-medium hidden md:table-cell">Joined</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#aba9bf]">
                      <div className="w-6 h-6 border-2 border-[#bd9dff]/30 border-t-[#bd9dff] rounded-full animate-spin mx-auto mb-3" />
                      Loading users...
                    </td>
                  </tr>
                ) : (
                  usersData.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#474659]/30 shrink-0 bg-gradient-to-br from-[#bd9dff] to-[#ff6daf] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-[#e6e3fb]">{u.name}</div>
                            <div className="text-xs text-[#aba9bf]">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            roles.find(r => r.id === u.role)?.color || "bg-[#23233b] text-[#aba9bf] border-[#474659]/20"
                          }`}
                        >
                          {roles.find(r => r.id === u.role)?.name || u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#aba9bf] text-xs font-mono hidden md:table-cell">
                        {new Date(u.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPermTarget(u)}
                            className="text-[#bd9dff] hover:text-[#e6e3fb] transition-colors p-1.5 rounded-lg hover:bg-[#bd9dff]/10"
                            title="Manage Permissions"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button onClick={() => alert(`Edit ${u.name}'s profile`)} className="text-[#aba9bf] hover:text-[#e6e3fb] transition-colors p-1.5 rounded-lg hover:bg-white/5">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => alert(`Initiate delete for ${u.name}`)} className="text-[#aba9bf] hover:text-[#ff6e84] transition-colors p-1.5 rounded-lg hover:bg-[#ff6e84]/10">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-[#aba9bf] bg-[#111124]/30">
            <div>
              Showing <span className="font-mono text-[#e6e3fb]">{usersData.length}</span> users
            </div>
            <div className="flex items-center gap-1">
              <button disabled className="p-1 hover:text-[#e6e3fb] hover:bg-white/5 rounded disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-6 h-6 rounded bg-[#bd9dff]/20 text-[#bd9dff] font-medium flex items-center justify-center">
                1
              </button>
              <button className="p-1 hover:text-[#e6e3fb] hover:bg-white/5 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1d]/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(189,157,255,0.08)] relative bg-[#18182b] border border-[#474659]/30"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#bd9dff]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
              <h3 className="font-heading text-xl font-bold text-[#e6e3fb]">
                Add New User
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#aba9bf] hover:text-[#e6e3fb] transition-colors p-1 rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#aba9bf]">First Name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#aba9bf]">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#aba9bf]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-[#aba9bf] w-4 h-4" />
                  <input
                    type="email"
                    placeholder="jane.doe@marketpro.com"
                    className="w-full bg-[#111124] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#aba9bf]">Role Assignment</label>
                <select
                  defaultValue=""
                  className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all cursor-pointer"
                >
                  <option disabled value="">Select a role...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-[#000000]/30 relative z-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#e6e3fb] hover:bg-white/5 transition-colors border border-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("User creation request sent. Awaiting email verification.");
                  setIsModalOpen(false);
                }}
                className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0c0c1d] hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all">
                Create User
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Permission Modal */}
      {permTarget && currentUser && (
        <PermissionModal
          targetUser={permTarget}
          onClose={() => setPermTarget(null)}
          currentUserId={currentUser.id}
        />
      )}
    </motion.div>
  );
}
