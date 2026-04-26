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
    badge: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    dot: "bg-emerald-500",
  },
  "Follow-up": {
    badge: "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
    dot: "bg-amber-500",
  },
  "Not Interested": {
    badge: "bg-destructive/10 text-destructive border border-destructive/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
    dot: "bg-destructive",
  },
  "Pending Log": {
    badge: "bg-muted text-muted-foreground border border-border shadow-sm",
    dot: "bg-muted-foreground",
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
    } else {
      console.error("Error saving visit:", error);
      alert("Failed to record visit. Please try again.");
    }
    setSaving(false);
  };

  const statusPills = [
    { label: "Interested", color: "#22c55e", glow: "rgba(34, 197, 94, 0.3)" },
    { label: "Not Interested", color: "#ffffff", glow: "rgba(255, 255, 255, 0.3)" },
    { label: "Follow-up", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.3)" },
  ];

  const inputClasses = "w-full glass-panel border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] focus:outline-none transition-all placeholder:text-muted-foreground";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl relative glass-panel border-border"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="p-8 border-b border-border/50 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center border-primary/20 bg-primary/10 shadow-inner">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground tracking-tight">Record Field Visit</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Enter client details and outcome.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Company Name *</label>
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
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Contact Person</label>
              <input 
                value={form.contact} 
                onChange={(e) => setForm({ ...form, contact: e.target.value })} 
                type="text" 
                placeholder="Name & Title" 
                className={inputClasses} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
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
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
              <input 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                type="email" 
                placeholder="client@email.com" 
                className={inputClasses} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Visit Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  value={form.visit_date} 
                  onChange={(e) => setForm({ ...form, visit_date: e.target.value })} 
                  type="date" 
                  className={`${inputClasses} pl-12`} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Status Selector</label>
            <div className="flex flex-wrap gap-3">
              {statusPills.map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => setForm({ ...form, status: pill.label })}
                  className={`flex-1 min-w-[100px] px-4 py-3 rounded-2xl text-xs font-bold transition-all border shadow-sm ${
                    form.status === pill.label
                      ? "glass-panel border-primary/50 shadow-lg scale-[1.02]"
                      : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                  }`}
                  style={{ 
                    color: form.status === pill.label ? pill.color : undefined,
                    boxShadow: form.status === pill.label ? `0 0 20px ${pill.glow}` : undefined,
                    borderColor: form.status === pill.label ? pill.color + '40' : undefined
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: pill.color }} />
                    {pill.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Notes</label>
            <textarea 
              value={form.notes} 
              onChange={(e) => setForm({ ...form, notes: e.target.value })} 
              placeholder="Describe the meeting outcome, next steps..." 
              rows={4}
              className={`${inputClasses} resize-none`}
            />
          </div>
        </div>

        <div className="p-8 border-t border-border/50 bg-muted/30 relative z-10">
          <button 
            onClick={handleSubmit} 
            disabled={saving || !form.company} 
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-base font-bold shadow-sm hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
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
            <h1 className="font-heading text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3 mb-2">
              Field Visits
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shadow-sm">
                {visits.length} Total
              </span>
            </h1>
            <p className="text-base font-medium text-muted-foreground max-w-2xl">Monitor active agent deployments, track outcomes, and manage follow-ups across all regional territories.</p>
          </div>
          <div className="shrink-0">
            <button onClick={() => setShowModal(true)} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 group">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              Add Visit
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel border-border/50 rounded-2xl p-3 mb-6 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-sm">
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="relative">
              <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 pl-11 pr-10 rounded-xl glass-panel border border-border text-sm font-bold text-foreground appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer shadow-sm">
                <option value="All" className="bg-background">Status: All</option>
                {statusOptions.map((s) => (<option key={s} value={s} className="bg-background">{s}</option>))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <div className="relative w-full lg:w-64 hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter this view..." className="w-full h-10 glass-panel border border-border text-foreground text-sm font-medium rounded-xl pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground shadow-sm" />
            </div>
            <div className="h-6 w-px bg-border hidden lg:block mx-2" />
            <div className="flex glass-panel rounded-xl p-1 border-border shadow-sm">
              <button onClick={() => setViewMode("table")} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Table2 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("grid")} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-panel border-border/50 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold text-muted-foreground">Loading visits...</p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="px-6 py-5 font-bold text-xs text-muted-foreground uppercase tracking-widest">Company & Contact</th>
                    <th className="px-6 py-5 font-bold text-xs text-muted-foreground uppercase tracking-widest hidden md:table-cell">Contact Details</th>
                    <th className="px-6 py-5 font-bold text-xs text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Visit Date</th>
                    <th className="px-6 py-5 font-bold text-xs text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 font-bold text-xs text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Agent</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border/30">
                  {filtered.map((visit) => {
                    const sc = statusConfig[visit.status] || statusConfig["Pending Log"];
                    return (
                      <tr key={visit.id} className="group hover:bg-muted/30 transition-colors relative">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-border text-primary font-heading font-extrabold text-xs shadow-sm">{initials(visit.company)}</div>
                            <div>
                              <div className="font-bold text-foreground group-hover:text-primary transition-colors">{visit.company}</div>
                              <div className="text-xs font-medium text-muted-foreground mt-0.5">{visit.contact || "No contact"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="text-foreground font-mono font-bold text-xs">{visit.phone || "—"}</div>
                          <div className="text-muted-foreground font-medium text-xs mt-0.5">{visit.email || "—"}</div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="text-foreground font-bold">{new Date(visit.visit_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                          <div className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mt-0.5 font-mono">{new Date(visit.visit_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {visit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-sm">{initials(visit.user_name)}</div>
                            <span className="text-foreground font-bold">{visit.user_name}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold">No visits found matching your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filtered.map((visit) => {
                const sc = statusConfig[visit.status] || statusConfig["Pending Log"];
                return (
                  <div key={visit.id} className="glass-panel rounded-2xl p-6 border-border/50 hover:border-primary/30 transition-colors group shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-border text-primary font-heading font-extrabold text-xs shadow-sm">{initials(visit.company)}</div>
                        <div>
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-base">{visit.company}</h4>
                          <p className="text-xs font-medium text-muted-foreground">{visit.contact || "No contact"}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.badge}`}>
                        <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                        {visit.status}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground space-y-2 mb-4 bg-muted/30 p-3 rounded-xl border border-border/50">
                      {visit.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary/70" />{visit.phone}</div>}
                      {visit.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary/70" />{visit.email}</div>}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                      <span className="text-muted-foreground font-bold font-mono tracking-widest uppercase">{new Date(visit.visit_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span className="text-foreground font-bold">{visit.user_name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border/50 bg-muted/20 px-6 py-4 flex items-center justify-between">
            <div className="text-xs font-bold text-muted-foreground">Showing <span className="font-mono text-foreground font-extrabold">{filtered.length}</span> of <span className="font-mono text-foreground font-extrabold">{visits.length}</span> entries</div>
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
