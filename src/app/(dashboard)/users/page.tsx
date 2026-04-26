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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl relative glass-panel"
      >
        {/* Modal Orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-border/50 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center border-primary/20 bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                Page Permissions
              </h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {targetUser.name} — {targetUser.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Grid */}
        <div className="p-6 space-y-3 relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            pageConfig.map((page) => {
              const Icon = page.icon;
              const visible = isVisible(page.slug);
              const isSaving = saving === page.slug;

              return (
                <div
                  key={page.slug}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 shadow-sm ${
                    visible
                      ? "glass-panel border-primary/20"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        visible ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-sm font-bold ${
                        visible ? "text-foreground" : "text-muted-foreground line-through"
                      }`}
                    >
                      {page.label}
                    </span>
                    {page.locked && (
                      <span className="text-[9px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Required
                      </span>
                    )}
                  </div>

                  {page.locked ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      <Eye className="w-3.5 h-3.5" />
                      Always On
                    </div>
                  ) : (
                    <button
                      onClick={() => togglePermission(page.slug)}
                      disabled={isSaving}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 border ${
                        visible
                          ? "bg-primary/20 border-primary shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                          : "bg-muted border-border"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                          visible
                            ? "left-[22px] bg-primary text-primary-foreground shadow-sm"
                            : "left-0.5 bg-muted-foreground/20 text-muted-foreground"
                        }`}
                      >
                        {isSaving ? (
                          <div className="w-3 h-3 border border-border border-t-foreground rounded-full animate-spin" />
                        ) : visible ? (
                          <Eye className="w-2.5 h-2.5" />
                        ) : (
                          <EyeOff className="w-2.5 h-2.5" />
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
        <div className="p-6 border-t border-border/50 flex justify-end bg-muted/30 relative z-10">
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:shadow-primary/30 transition-all"
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
            "radial-gradient(circle, rgba(228,228,231,0.2) 0%, rgba(64, 206, 237, 0) 70%)",
        }}
      />
      <div
        className="fixed bottom-[-200px] left-[100px] w-[800px] h-[800px] rounded-full pointer-events-none z-0 blur-[60px] will-change-transform transform-gpu"
        style={{
          background:
            "radial-gradient(circle, rgba(228,228,231,0.2) 0%, rgba(250, 83, 164, 0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 shrink-0">
          <div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight mb-2 text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground font-medium text-base max-w-lg">
              Manage access controls, assign roles, and monitor active sessions
              across the MarketPro ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => alert("Filter drawer opening...")} className="glass-panel px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-muted/50 transition-colors text-foreground border border-border shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Metric Cards Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 shrink-0">
          <div className="glass-panel rounded-[2rem] p-6 relative overflow-hidden group hover:shadow-md transition-shadow border border-border shadow-sm">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Total Users</span>
              <span className="text-primary bg-primary/10 p-2 rounded-xl border border-primary/20">
                <Users className="w-5 h-5" />
              </span>
            </div>
            <div className="font-heading text-4xl font-extrabold tracking-tight text-foreground relative z-10">
              {usersData.length}
            </div>
            <div className="mt-3 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 inline-flex items-center px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live count
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 relative overflow-hidden group hover:shadow-md transition-shadow border border-border shadow-sm">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Admins</span>
              <span className="text-indigo-500 bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20">
                <Radar className="w-5 h-5" />
              </span>
            </div>
            <div className="font-heading text-4xl font-extrabold tracking-tight text-foreground relative z-10">
              {usersData.filter((u) => u.role === "admin").length}
            </div>
            <div className="mt-3 text-xs font-bold text-muted-foreground bg-muted border border-border inline-flex items-center px-2 py-1 rounded-full">
              Full access users
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 relative overflow-hidden group hover:shadow-md transition-shadow border border-border shadow-sm">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Managers</span>
              <span className="text-amber-500 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                <Hourglass className="w-5 h-5" />
              </span>
            </div>
            <div className="font-heading text-4xl font-extrabold tracking-tight text-foreground relative z-10">
              {usersData.filter((u) => u.role === "manager").length}
            </div>
            <div className="mt-3 text-xs font-bold text-muted-foreground bg-muted border border-border inline-flex items-center px-2 py-1 rounded-full">
              Limited access users
            </div>
          </div>
        </div>

        {/* Users Table Container */}
        <div className="glass-panel rounded-[2rem] flex-1 flex flex-col overflow-hidden relative shadow-sm border-border/50">
          <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Directory
            </h2>
            <button onClick={() => alert("Opening directory options...")} className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-widest bg-muted/10">
                  <th className="py-5 px-6 font-bold">User</th>
                  <th className="py-5 px-6 font-bold">Role</th>
                  <th className="py-5 px-6 font-bold hidden md:table-cell">Joined</th>
                  <th className="py-5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border/30">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground font-bold">
                      <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
                      Loading users...
                    </td>
                  </tr>
                ) : (
                  usersData.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-border shrink-0 bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                            <span className="text-sm font-extrabold">
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-foreground group-hover:text-primary transition-colors">{u.name}</div>
                            <div className="text-xs font-medium text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                            roles.find(r => r.id === u.role)?.color || "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {roles.find(r => r.id === u.role)?.name || u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-xs font-bold font-mono hidden md:table-cell">
                        {new Date(u.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPermTarget(u)}
                            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 shadow-sm"
                            title="Manage Permissions"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button onClick={() => alert(`Edit ${u.name}'s profile`)} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted border border-transparent hover:border-border shadow-sm">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => alert(`Initiate delete for ${u.name}`)} className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-xl hover:bg-destructive/10 border border-transparent hover:border-destructive/20 shadow-sm">
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
          <div className="p-5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-muted/20 font-bold">
            <div>
              Showing <span className="font-mono text-foreground font-extrabold">{usersData.length}</span> users
            </div>
            <div className="flex items-center gap-2">
              <button disabled className="p-1.5 hover:text-foreground hover:bg-muted rounded-lg border border-transparent hover:border-border transition-colors disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-sm">
                1
              </button>
              <button className="p-1.5 hover:text-foreground hover:bg-muted rounded-lg border border-transparent hover:border-border transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl relative glass-panel border-border"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

            <div className="p-8 border-b border-border/50 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center border-primary/20 bg-primary/10">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Add New User
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Create system access.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted border border-transparent hover:border-border"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">First Name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className="w-full glass-panel border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] focus:outline-none transition-all placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full glass-panel border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] focus:outline-none transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-muted-foreground w-4 h-4" />
                  <input
                    type="email"
                    placeholder="jane.doe@marketpro.com"
                    className="w-full glass-panel border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] focus:outline-none transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Role Assignment</label>
                <select
                  defaultValue=""
                  className="w-full glass-panel border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] focus:outline-none transition-all cursor-pointer appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:calc(100%-1rem)_center]"
                >
                  <option disabled value="">Select a role...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id} className="text-foreground bg-background">{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-8 border-t border-border/50 bg-muted/30 relative z-10 flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 rounded-2xl text-sm font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 transition-colors border border-border shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("User creation request sent. Awaiting email verification.");
                  setIsModalOpen(false);
                }}
                className="flex-[2] bg-primary text-primary-foreground py-4 rounded-2xl text-base font-bold shadow-sm hover:shadow-lg hover:shadow-primary/30 transition-all">
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
