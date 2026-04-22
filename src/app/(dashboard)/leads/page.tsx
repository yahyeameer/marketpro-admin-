"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, CheckCircle, Mail, MoreHorizontal, X, MessageSquare, Phone } from "lucide-react";

export type LeadStatus = "inbound" | "converted" | "lost";

export interface Lead {
  id: string;
  companyName: string;
  timeAgo: string;
  contactName: string;
  contactRole: string;
  notes: string;
  status: LeadStatus;
  assigneeInitials?: string;
  actionText?: string;
  actionIcon?: "schedule" | "mail" | "archive" | "handover";
  value?: string;
  reason?: string;
}

function AddLeadModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ company: "", contact: "", role: "", notes: "", status: "inbound" as LeadStatus });

  const handleSubmit = async () => {
    if (!form.company || !form.contact) return;
    setSaving(true);
    
    // We need to create a dummy user to assign or just not use one.
    // Ideally leads are just entries, but the schema says leads relies on `visit_id`.
    // Let's create a stub field_visit first, then link it to the lead.
    const supabase = createClient();
    
    // 1. Get first user as assignee
    const { data: users } = await supabase.from("users").select("id").limit(1);
    const userId = users?.[0]?.id;

    if (!userId) {
      setSaving(false);
      return;
    }

    // 2. Create visit stub
    const { data: visitData, error: visitError } = await supabase.from("field_visits").insert({
      user_id: userId,
      company: form.company,
      contact: `${form.contact}, ${form.role}`,
      notes: form.notes,
      status: "lead",
      visit_date: new Date().toISOString()
    }).select("id").single();

    if (!visitError && visitData) {
      // 3. Create lead
      await supabase.from("leads").insert({
        visit_id: visitData.id,
        status: form.status
      });
      onSave();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1d]/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(189,157,255,0.08)] relative bg-[#18182b] border border-[#474659]/30">
        <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
          <h3 className="font-heading text-lg font-bold text-[#e6e3fb]">Add New Lead</h3>
          <button onClick={onClose} className="text-[#aba9bf] hover:text-[#e6e3fb] p-1 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#aba9bf]">Company Name *</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} type="text" className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:outline-none focus:border-[#53ddfc]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#aba9bf]">Contact Name *</label>
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} type="text" className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:outline-none focus:border-[#53ddfc]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#aba9bf]">Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} type="text" className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:outline-none focus:border-[#53ddfc]" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#aba9bf]">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })} className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:outline-none focus:border-[#53ddfc]">
              <option value="inbound">Inbound</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#aba9bf]">Notes</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} type="text" className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:outline-none focus:border-[#53ddfc]" />
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-[#000000]/30 relative z-10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#e6e3fb] hover:bg-white/5">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !form.company || !form.contact} className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0c0c1d]">
            {saving ? "Saving..." : "Add Lead"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const isConverted = lead.status === "converted";
  const isLost = lead.status === "lost";

  return (
    <motion.div
      layoutId={lead.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#1d1d33] rounded-xl p-5 border border-[#474659]/20 transition-colors relative overflow-hidden group 
        ${isLost ? "opacity-75 grayscale-[30%]" : "hover:border-[#40ceed]/50 cursor-grab"}
        ${isConverted ? "opacity-90" : ""}
      `}
    >
      <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${isConverted ? "bg-[#00687a]" : isLost ? "bg-[#ff6e84]/50" : "bg-[#23233b] group-hover:bg-[#40ceed]/50"}`} />

      <div className="flex justify-between items-start mb-3">
        <h4 className={`font-heading font-bold text-[#e6e3fb] ${isLost ? "line-through decoration-[#ff6e84]/50" : ""}`}>{lead.companyName}</h4>
        <span className="text-xs font-mono text-[#aba9bf]">{lead.timeAgo}</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {isConverted ? (
           <div className="w-6 h-6 rounded-full bg-[#00687a]/20 flex items-center justify-center border border-[#00687a]/30"><CheckCircle className="w-3.5 h-3.5 text-[#53ddfc]" /></div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#23233b] flex items-center justify-center border border-[#474659]/30">
            <svg className="w-3.5 h-3.5 text-[#aba9bf]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        <span className="text-sm text-[#aba9bf] font-body">{lead.contactName} {lead.contactRole ? `, ${lead.contactRole}` : ""}</span>
      </div>

      {!isConverted && !isLost && lead.notes && <p className="text-xs text-[#aba9bf] font-body mb-4 line-clamp-2 italic">{lead.notes}</p>}

      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <div className="flex -space-x-2">
           {lead.assigneeInitials && (
              <div className="w-6 h-6 rounded-full bg-[#23233b] border border-[#1d1d33] z-10 flex items-center justify-center text-[10px] text-[#e6e3fb] font-bold">
                {lead.assigneeInitials}
              </div>
           )}
        </div>
        <span className={`text-xs font-medium flex items-center gap-1 ${lead.status === "inbound" ? "text-[#40ceed]" : "text-[#aba9bf]"}`}>
          {lead.actionIcon === "schedule" && <Clock className="w-3.5 h-3.5" />}
          {lead.actionIcon === "mail" && <Mail className="w-3.5 h-3.5" />}
          {lead.actionIcon === "archive" && <MoreHorizontal className="w-3.5 h-3.5" />}
          {lead.actionIcon === "handover" && <CheckCircle className="w-3.5 h-3.5" />}
          {lead.actionText}
        </span>
      </div>
    </motion.div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select(`
      id, status, created_at,
      field_visits ( company, contact, notes, users ( name ) )
    `);

    if (data) {
      const mappedLeads: Lead[] = data.map((lead: any) => {
        const visit = lead.field_visits;
        const companyName = visit?.company || "Unknown Company";
        
        let contactName = visit?.contact || "Unknown Contact";
        let contactRole = "";
        if (visit?.contact?.includes(",")) {
           const parts = visit.contact.split(",");
           contactName = parts[0];
           contactRole = parts[1]?.trim() || "";
        }

        const assigneeName = visit?.users?.name || "";
        const assigneeInitials = assigneeName.split(" ").map((n: string) => n[0]).join("") || "UNK";

        const diffDays = Math.floor(Math.abs(new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
        const timeAgo = diffDays > 0 ? `${diffDays}d ago` : "Today";

        return {
          id: lead.id,
          companyName,
          timeAgo,
          contactName,
          contactRole,
          notes: visit?.notes || "",
          status: lead.status as LeadStatus,
          assigneeInitials,
          actionText: lead.status === "inbound" ? "Follow up today" : lead.status === "converted" ? "Handed to CSM" : "Archived",
          actionIcon: lead.status === "inbound" ? "schedule" : lead.status === "converted" ? "handover" : "archive"
        };
      });
      setLeads(mappedLeads);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-[#e6e3fb] mb-2 tracking-tight">Lead Pipeline</h2>
          <p className="text-[#aba9bf] font-body text-sm max-w-xl">Track and manage prospective clients through the sales cycle. High priority targets are highlighted.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-5 py-2.5 rounded-full bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-black font-heading font-semibold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all">
          <Plus className="w-5 h-5" /> New Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)] overflow-hidden">
        {["inbound", "converted", "lost"].map((status) => {
          const colLeads = leads.filter(l => l.status === status);
          const color = status === "inbound" ? "bg-[#40ceed]" : status === "converted" ? "bg-[#00687a]" : "bg-[#ff6e84]";
          return (
            <div key={status} className="flex flex-col bg-[#111124]/50 rounded-[2rem] p-4 border border-[#474659]/15 shadow-[0_0_60px_rgba(138,76,252,0.05)] h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <h3 className="font-heading font-bold text-[#e6e3fb] text-lg capitalize">{status} Leads</h3>
                </div>
                <span className="bg-[#23233b] text-[#aba9bf] text-xs font-bold font-mono px-2.5 py-1 rounded-full">{colLeads.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {colLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && <AddLeadModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); fetchLeads(); }} />}
      </AnimatePresence>
    </>
  );
}
