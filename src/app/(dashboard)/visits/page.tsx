"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  ChevronDown,
  ListFilter,
  User,
  Search,
  Table2,
  LayoutGrid,
  MoreVertical,
  X,
  MapPin,
  Phone,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/components/providers/user-provider";
import { logActivity } from "@/lib/utils/log-activity";

interface Visit {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  visit_date: string;
  status: string;
  notes: string;
  user_name: string;
}

const statusConfig: Record<string, { badge: string; dot: string }> = {
  Interested: {
    badge: "bg-[#004b58]/30 text-[#53ddfc] border border-[#53ddfc]/20 shadow-[0_0_10px_rgba(83,221,252,0.1)]",
    dot: "bg-[#53ddfc]",
  },
  "Follow-up": {
    badge: "bg-[#740044]/30 text-[#ff8cbc] border border-[#ff8cbc]/20 shadow-[0_0_10px_rgba(255,140,188,0.1)]",
    dot: "bg-[#ff8cbc]",
  },
  "Not Interested": {
    badge: "bg-[#a70138]/30 text-[#ff6e84] border border-[#ff6e84]/20 shadow-[0_0_10px_rgba(255,110,132,0.1)]",
    dot: "bg-[#ff6e84]",
  },
  "Pending Log": {
    badge: "bg-[#2a2a43] text-[#aba9bf] border border-[#e6e3fb]/10",
    dot: "bg-[#757388]",
  },
};

const statusOptions = ["Interested", "Follow-up", "Not Interested", "Pending Log"];

function AddVisitModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: () => void;
}) {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: "",
    contact: "",
    phone: "",
    email: "",
    status: "Interested",
    notes: "",
    visit_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async () => {
    if (!form.company || !user) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("field_visits").insert({
      user_id: user.id,
      company: form.company,
      contact: form.contact,
      phone: form.phone,
      email: form.email,
      status: form.status,
      notes: form.notes,
      visit_date: new Date(form.visit_date).toISOString(),
    });

    if (!error) {
      await logActivity(user.id, "created_visit", "visit", undefined, {
        company: form.company,
      });
      onSave();
    }
    setSaving(false);
  };

  const statusPills = [
    { label: "Interested", color: "#22c55e", glow: "rgba(34, 197, 94, 0.3)" },
    { label: "Not Interested", color: "#ef4444", glow: "rgba(239, 68, 68, 0.3)" },
    { label: "Follow-up", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.3)" },
  ];

  const inputClasses = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-4 focus:ring-[#53ddfc]/10 focus:shadow-[0_0_20px_rgba(83,221,252,0.15)] focus:outline-none transition-all placeholder:text-[#aba9bf]/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1d]/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(189,157,255,0.15)] relative bg-[#18182b]/80 border border-white/10 backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#bd9dff]/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#bd9dff]/20 to-[#53ddfc]/20 flex items-center justify-center border border-white/10 shadow-inner">
              <MapPin className="w-6 h-6 text-[#bd9dff]" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white tracking-tight">Record Field Visit</h3>
              <p className="text-xs text-[#aba9bf]">Enter client details and outcome.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#aba9bf] hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Company Name *</label>
            <input 
              value={form.company} 
              onChange={(e) => setForm({ ...form, company: e.target.value })} 
              type="text" 
              placeholder="e.g. Global Tech Solutions" 
              className={inputClasses} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Contact Person</label>
              <input 
                value={form.contact} 
                onChange={(e) => setForm({ ...form, contact: e.target.value })} 
                type="text" 
                placeholder="Name & Title" 
                className={inputClasses} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                type="tel" 
                placeholder="+1 (555) 000-0000" 
                className={inputClasses} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Email Address</label>
              <input 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                type="email" 
                placeholder="client@email.com" 
                className={inputClasses} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Visit Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bd9dff]" />
                <input 
                  value={form.visit_date} 
                  onChange={(e) => setForm({ ...form, visit_date: e.target.value })} 
                  type="date" 
                  className={`${inputClasses} pl-12 [color-scheme:dark]`} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Status Selector</label>
            <div className="flex flex-wrap gap-3">
              {statusPills.map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => setForm({ ...form, status: pill.label })}
                  className={`flex-1 min-w-[100px] px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    form.status === pill.label
                      ? "bg-white/10 border-white/20 shadow-lg scale-[1.02]"
                      : "bg-white/[0.02] border-white/5 text-[#aba9bf] hover:bg-white/5"
                  }`}
                  style={{ 
                    color: form.status === pill.label ? pill.color : undefined,
                    boxShadow: form.status === pill.label ? `0 0 20px ${pill.glow}` : undefined,
                    borderColor: form.status === pill.label ? pill.color + '40' : undefined
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pill.color }} />
                    {pill.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Notes</label>
            <textarea 
              value={form.notes} 
              onChange={(e) => setForm({ ...form, notes: e.target.value })} 
              placeholder="Describe the meeting outcome, next steps..." 
              rows={4}
              className={`${inputClasses} resize-none`}
            />
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/20 relative z-10">
          <button 
            onClick={handleSubmit} 
            disabled={saving || !form.company} 
            className="w-full bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] py-4 rounded-2xl text-base font-bold text-[#0c0c1d] shadow-[0_8px_30px_rgba(189,157,255,0.3)] hover:shadow-[0_12px_40px_rgba(189,157,255,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {saving ? "Processing..." : "Submit Visit"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VisitsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchVisits = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("field_visits")
      .select("id, company, contact, phone, email, visit_date, status, notes, users(name)")
      .order("visit_date", { ascending: false });

    if (data) {
      setVisits(
        data.map((v: any) => ({
          ...v,
          user_name: v.users?.name || "Unknown",
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchVisits(); }, [fetchVisits]);

  const filtered = visits.filter((v) => {
    const matchesSearch = searchQuery === "" || v.company.toLowerCase().includes(searchQuery.toLowerCase()) || v.contact?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const initials = (name: string) => name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "??";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10">
      <div className="fixed top-0 left-[240px] w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#40ceed] opacity-10 blur-[80px] will-change-transform transform-gpu" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#fa53a4] opacity-5 blur-[80px] will-change-transform transform-gpu" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#e6e3fb] tracking-tight flex items-center gap-3">
              Field Visits
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#23233b] text-[#aba9bf] border border-white/5">
                {visits.length} Total
              </span>
            </h1>
            <p className="text-sm text-[#aba9bf] mt-1 max-w-2xl">Monitor active agent deployments, track outcomes, and manage follow-ups across all regional territories.</p>
          </div>
          <div className="shrink-0">
            <button onClick={() => setShowModal(true)} className="h-10 px-5 rounded-lg bg-gradient-to-br from-[#bd9dff] to-[#ff6daf] text-white text-sm font-semibold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(189,157,255,0.3)] transition-all active:scale-95 group">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Add Visit
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-2 mb-6 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="relative">
              <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aba9bf] pointer-events-none" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 pl-9 pr-8 rounded-lg bg-[#111124] border border-white/5 text-sm text-[#e6e3fb] appearance-none focus:outline-none focus:border-[#53ddfc] transition-colors cursor-pointer">
                <option value="All">Status: All</option>
                {statusOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aba9bf] pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <div className="relative w-full lg:w-64 hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aba9bf] w-4 h-4" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter this view..." className="w-full h-9 bg-black border border-white/5 text-[#e6e3fb] text-sm rounded-lg pl-9 pr-3 focus:outline-none focus:border-[#53ddfc] focus:ring-1 focus:ring-[#53ddfc]/50 transition-all placeholder:text-white/30" />
            </div>
            <div className="h-6 w-px bg-white/10 hidden lg:block mx-1" />
            <div className="flex bg-[#111124] rounded-lg p-1 border border-white/5">
              <button onClick={() => setViewMode("table")} className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${viewMode === "table" ? "bg-[#23233b] text-white shadow-sm" : "text-[#aba9bf] hover:text-white"}`}>
                <Table2 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("grid")} className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-[#23233b] text-white shadow-sm" : "text-[#aba9bf] hover:text-white"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#bd9dff]/30 border-t-[#bd9dff] rounded-full animate-spin mb-4" />
              <p className="text-sm text-[#aba9bf]">Loading visits...</p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-[#111124]/50">
                    <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider">Company & Contact</th>
                    <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider hidden md:table-cell">Contact Details</th>
                    <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider hidden lg:table-cell">Visit Date</th>
                    <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-heading text-xs font-semibold text-[#aba9bf] uppercase tracking-wider hidden lg:table-cell">Agent</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {filtered.map((visit) => {
                    const sc = statusConfig[visit.status] || statusConfig["Pending Log"];
                    return (
                      <tr key={visit.id} className="group hover:bg-white/[0.02] transition-colors relative">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#18182b] flex items-center justify-center border border-white/10 text-[#bd9dff] font-heading font-bold text-xs">{initials(visit.company)}</div>
                            <div>
                              <div className="font-semibold text-[#e6e3fb] group-hover:text-[#bd9dff] transition-colors">{visit.company}</div>
                              <div className="text-xs text-[#aba9bf] mt-0.5">{visit.contact || "No contact"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="text-[#e6e3fb] font-mono text-xs">{visit.phone || "—"}</div>
                          <div className="text-[#aba9bf] text-xs mt-0.5">{visit.email || "—"}</div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="text-[#e6e3fb]">{new Date(visit.visit_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                          <div className="text-[#aba9bf] text-xs mt-0.5 font-mono">{new Date(visit.visit_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {visit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#bd9dff] to-[#ff6daf] flex items-center justify-center text-white text-[10px] font-bold">{initials(visit.user_name)}</div>
                            <span className="text-[#e6e3fb]">{visit.user_name}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#aba9bf]">No visits found matching your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filtered.map((visit) => {
                const sc = statusConfig[visit.status] || statusConfig["Pending Log"];
                return (
                  <div key={visit.id} className="bg-[#111124]/50 rounded-xl p-5 border border-[#474659]/20 hover:border-[#53ddfc]/30 transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#18182b] flex items-center justify-center border border-white/10 text-[#bd9dff] font-heading font-bold text-xs">{initials(visit.company)}</div>
                        <div>
                          <h4 className="font-semibold text-[#e6e3fb] text-sm">{visit.company}</h4>
                          <p className="text-xs text-[#aba9bf]">{visit.contact || "No contact"}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.badge}`}>
                        <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                        {visit.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#aba9bf] space-y-1 mb-3">
                      {visit.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{visit.phone}</div>}
                      {visit.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{visit.email}</div>}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                      <span className="text-[#aba9bf] font-mono">{new Date(visit.visit_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span className="text-[#bd9dff] font-medium">{visit.user_name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-white/5 bg-[#111124]/30 px-6 py-3 flex items-center justify-between">
            <div className="text-xs text-[#aba9bf]">Showing <span className="font-mono text-[#e6e3fb]">{filtered.length}</span> of <span className="font-mono text-[#e6e3fb]">{visits.length}</span> entries</div>
          </div>
        </div>
      </div>

      {/* Add Visit Modal */}
      <AnimatePresence>
        {showModal && (
          <AddVisitModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); fetchVisits(); }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
