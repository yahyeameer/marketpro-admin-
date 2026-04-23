"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, CheckCircle, Mail, MoreHorizontal, X, MessageSquare, Phone, TrendingUp, User, Target, Trophy, Trash2, Edit2, Rocket } from "lucide-react";
import { useCampaignGoals, type CampaignGoal } from "@/lib/hooks/use-campaign-goals";

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
    const supabase = createClient();
    const { data: users } = await supabase.from("users").select("id").limit(1);
    const userId = users?.[0]?.id;
    if (!userId) {
      setSaving(false);
      return;
    }
    const { data: visitData, error: visitError } = await supabase.from("field_visits").insert({
      user_id: userId,
      company: form.company,
      contact: `${form.contact}, ${form.role}`,
      notes: form.notes,
      status: "lead",
      visit_date: new Date().toISOString()
    }).select("id").single();

    if (!visitError && visitData) {
      await supabase.from("leads").insert({
        visit_id: visitData.id,
        status: form.status
      });
      onSave();
    }
    setSaving(false);
  };

  const inputClasses = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-4 focus:ring-[#53ddfc]/10 focus:shadow-[0_0_20px_rgba(83,221,252,0.15)] focus:outline-none transition-all placeholder:text-[#aba9bf]/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1d]/90 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-lg rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(189,157,255,0.15)] relative bg-[#18182b]/80 border border-white/10 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#bd9dff]/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="p-8 border-b border-white/5 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#bd9dff]/10 flex items-center justify-center border border-white/10"><TrendingUp className="w-6 h-6 text-[#bd9dff]" /></div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white tracking-tight">Add New Lead</h3>
              <p className="text-xs text-[#aba9bf]">Create a pipeline target.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#aba9bf] hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-8 space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Company Name *</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} type="text" placeholder="Acme Corp" className={inputClasses} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Contact Name *</label>
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} type="text" placeholder="John Doe" className={inputClasses} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} type="text" placeholder="CEO" className={inputClasses} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Lead Status</label>
            <div className="flex gap-2">
              {(["inbound", "converted", "lost"] as LeadStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    form.status === s 
                    ? s === "inbound" ? "bg-[#53ddfc]/20 border-[#53ddfc]/50 text-[#53ddfc] shadow-[0_0_15px_rgba(83,221,252,0.2)]" 
                      : s === "converted" ? "bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                      : "bg-[#ff6e84]/20 border-[#ff6e84]/50 text-[#ff6e84] shadow-[0_0_15px_rgba(255,110,132,0.2)]"
                    : "bg-white/5 border-white/5 text-[#aba9bf] hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-widest ml-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add initial contact notes..." className={`${inputClasses} min-h-[100px] resize-none`} />
          </div>
        </div>
        <div className="p-8 border-t border-white/5 bg-black/20 relative z-10">
          <button onClick={handleSubmit} disabled={saving || !form.company || !form.contact} className="w-full bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] py-4 rounded-2xl text-base font-bold text-[#0c0c1d] shadow-[0_8px_30px_rgba(189,157,255,0.3)] hover:shadow-[0_12px_40px_rgba(189,157,255,0.5)] transition-all disabled:opacity-50">
            {saving ? "Creating..." : "Add to Pipeline"}
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
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative group p-5 rounded-2xl border transition-all backdrop-blur-xl
        ${isLost ? "bg-white/[0.02] border-white/5 opacity-80" : "bg-white/[0.04] border-white/10 shadow-xl"}
        ${isConverted ? "border-green-500/20" : ""}
      `}
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${
        isConverted ? "bg-green-500" : isLost ? "bg-[#ff6e84]" : "bg-[#53ddfc]"
      }`} />

      <div className="flex justify-between items-start mb-3">
        <h4 className="font-heading font-bold text-white text-base leading-tight">{lead.companyName}</h4>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/5">
          <Clock className="w-3 h-3 text-[#aba9bf]" />
          <span className="text-[10px] font-bold text-[#aba9bf] uppercase">{lead.timeAgo}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
          <User className="w-4 h-4 text-[#bd9dff]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#e6e3fb] leading-none">{lead.contactName}</span>
          <span className="text-[10px] text-[#aba9bf] uppercase tracking-widest mt-1 font-bold">{lead.contactRole || "Contact"}</span>
        </div>
      </div>

      {lead.notes && (
        <p className="text-xs text-[#aba9bf] line-clamp-2 italic mb-4 px-2 py-2 bg-white/5 rounded-lg border border-white/5">
          "{lead.notes}"
        </p>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] p-[1px]">
            <div className="w-full h-full rounded-[7px] bg-[#1d1d33] flex items-center justify-center text-[10px] font-bold text-white">
              {lead.assigneeInitials}
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#aba9bf] uppercase tracking-widest">Assignee</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
          ${lead.status === 'inbound' ? 'bg-[#53ddfc]/10 text-[#53ddfc] border border-[#53ddfc]/20' : 'bg-white/5 text-[#aba9bf] border border-white/5'}
        `}>
          {lead.actionIcon === "schedule" && <Clock className="w-3 h-3" />}
          {lead.actionIcon === "mail" && <Mail className="w-3 h-3" />}
          {lead.actionIcon === "archive" && <MoreHorizontal className="w-3.5 h-3.5" />}
          {lead.actionIcon === "handover" && <CheckCircle className="w-3 h-3" />}
          {lead.actionText}
        </div>
      </div>
    </motion.div>
  );
}

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "campaigns">("pipeline");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  
  const { goals, addGoal, updateProgress, deleteGoal } = useCampaignGoals();
  const supabase = createClient();

  const handleUpdateGoal = (id: string, newCurrent: number) => {
    const achievedTitle = updateProgress(id, newCurrent);
    if (achievedTitle) {
      setToast({ message: `🎉 Incredible! "${achievedTitle}" goal has been ACHIEVED!`, type: 'success' });
      setTimeout(() => setToast(null), 5000);
    }
  };

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
        const timeAgo = diffDays > 0 ? `${diffDays}d` : "Today";

        return {
          id: lead.id,
          companyName,
          timeAgo,
          contactName,
          contactRole,
          notes: visit?.notes || "",
          status: lead.status as LeadStatus,
          assigneeInitials,
          actionText: lead.status === "inbound" ? "Follow up" : lead.status === "converted" ? "Converted" : "Archived",
          actionIcon: lead.status === "inbound" ? "schedule" : lead.status === "converted" ? "handover" : "archive"
        };
      });
      setLeads(mappedLeads);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <div className="relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h2 className="text-4xl font-heading font-extrabold text-white mb-2 tracking-tight">Lead Management</h2>
          <p className="text-[#aba9bf] font-body text-base max-w-xl">Manage prospects, track conversions, and monitor street marketing campaigns.</p>
        </div>
        
        <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab("pipeline")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "pipeline" ? "bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-[#0c0c1d] shadow-[0_0_20px_rgba(189,157,255,0.3)]" : "text-[#aba9bf] hover:text-white"}`}
          >
            Pipeline
          </button>
          <button 
            onClick={() => setActiveTab("campaigns")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "campaigns" ? "bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-[#0c0c1d] shadow-[0_0_20px_rgba(189,157,255,0.3)]" : "text-[#aba9bf] hover:text-white"}`}
          >
            <Target className="w-4 h-4" />
            Campaign Goals
          </button>
        </div>
      </div>

      {activeTab === "pipeline" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end mb-6">
            <button onClick={() => setShowModal(true)} className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-heading font-bold text-sm flex items-center gap-2 border border-white/10 hover:bg-white/20 transition-all">
              <Plus className="w-4 h-4" /> New Lead
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible">
            {(["inbound", "converted", "lost"] as LeadStatus[]).map((status) => {
              const colLeads = leads.filter(l => l.status === status);
              const color = status === "inbound" ? "bg-[#53ddfc]" : status === "converted" ? "bg-green-500" : "bg-[#ff6e84]";
              return (
                <div key={status} className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-auto snap-center flex flex-col bg-white/[0.02] rounded-[2.5rem] p-6 border border-white/5 backdrop-blur-3xl h-[calc(100vh-280px)] min-h-[500px]">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${color} shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
                      <h3 className="font-heading font-bold text-white text-xl capitalize tracking-tight">{status}</h3>
                    </div>
                    <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[#aba9bf] text-xs font-bold font-mono">
                      {colLeads.length}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar pb-4">
                    {colLeads.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-30">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#aba9bf] mb-3" />
                        <p className="text-xs font-bold uppercase tracking-widest text-[#aba9bf]">No {status} leads</p>
                      </div>
                    ) : (
                      colLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden group shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#53ddfc]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[#aba9bf] text-sm font-medium">Active Goals</span>
                <span className="text-[#53ddfc] bg-[#53ddfc]/10 p-1.5 rounded-md"><Target className="w-4 h-4" /></span>
              </div>
              <div className="font-heading text-3xl font-bold text-[#e6e3fb]">{goals.filter(g => g.status === 'active').length}</div>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden group shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[#aba9bf] text-sm font-medium">Goals Achieved</span>
                <span className="text-green-500 bg-green-500/10 p-1.5 rounded-md"><Trophy className="w-4 h-4" /></span>
              </div>
              <div className="font-heading text-3xl font-bold text-[#e6e3fb]">{goals.filter(g => g.status === 'achieved').length}</div>
            </div>
            <div className="flex items-center justify-center">
              <button onClick={() => setShowGoalModal(true)} className="w-full h-full min-h-[100px] rounded-xl border-2 border-dashed border-[#bd9dff]/30 text-[#bd9dff] font-bold flex flex-col items-center justify-center gap-2 hover:bg-[#bd9dff]/5 hover:border-[#bd9dff]/50 transition-all">
                <Rocket className="w-6 h-6" />
                Launch New Campaign
              </button>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl overflow-hidden shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#111124]/50">
              <h2 className="font-heading text-lg font-semibold text-[#e6e3fb]">Street Marketing Leaderboard</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-[#aba9bf] uppercase tracking-wider bg-[#111124]/30">
                    <th className="py-4 px-6 font-medium">Campaign Goal</th>
                    <th className="py-4 px-6 font-medium">Assigned Marketer</th>
                    <th className="py-4 px-6 font-medium">Progress</th>
                    <th className="py-4 px-6 font-medium text-center">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {goals.map(goal => {
                    const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                    return (
                      <tr key={goal.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#e6e3fb]">{goal.title}</div>
                          <div className="text-[10px] text-[#aba9bf] uppercase tracking-widest mt-1">Target: {goal.target} Leads</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#bd9dff]/20 text-[#bd9dff] flex items-center justify-center text-[10px] font-bold">
                              {goal.marketerName.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-[#aba9bf] font-medium">{goal.marketerName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
                            <div className="flex justify-between text-[10px] font-bold font-mono">
                              <span className="text-[#53ddfc]">{goal.current} achieved</span>
                              <span className="text-[#aba9bf]">{percent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#23233b] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-[#53ddfc]'}`} style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {goal.status === 'achieved' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20"><Trophy className="w-3 h-3" /> Achieved</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-[#53ddfc]/10 text-[#53ddfc] rounded border border-[#53ddfc]/20"><Rocket className="w-3 h-3" /> Active</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {goal.status !== 'achieved' && (
                              <button onClick={() => handleUpdateGoal(goal.id, goal.current + 1)} className="px-2 py-1 bg-white/5 hover:bg-[#53ddfc]/20 text-[#aba9bf] hover:text-[#53ddfc] text-xs font-bold rounded transition-colors border border-white/5 border-transparent hover:border-[#53ddfc]/30">
                                +1 Lead
                              </button>
                            )}
                            <button onClick={() => deleteGoal(goal.id)} className="p-1.5 text-[#aba9bf] hover:text-[#ff6e84] bg-white/5 hover:bg-[#ff6e84]/10 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {goals.length === 0 && (
                    <tr><td colSpan={5} className="py-12 text-center text-[#aba9bf]">No campaign goals active.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed bottom-6 right-6 z-[100] bg-green-500/20 backdrop-blur-xl border border-green-500/50 p-4 rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.3)] flex items-center gap-3 max-w-sm">
            <div className="p-2 bg-green-500 rounded-xl text-[#0c0c1d]"><Trophy className="w-6 h-6" /></div>
            <p className="text-sm font-bold text-white">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1d]/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-[#18182b] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#bd9dff]/20 rounded-full blur-3xl" />
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2"><Target className="w-5 h-5 text-[#bd9dff]" /> Setup Campaign Goal</h3>
                <button onClick={() => setShowGoalModal(false)} className="text-[#aba9bf] hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form className="space-y-4 relative z-10" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const marketerName = formData.get('marketer') as string;
                const target = parseInt(formData.get('target') as string, 10);
                if (title && marketerName && target) {
                  addGoal({ title, marketerName, target });
                  setShowGoalModal(false);
                }
              }}>
                <div>
                  <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-wider">Goal Title</label>
                  <input name="title" required type="text" placeholder="e.g. Summer Promo Street Leads" className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bd9dff]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-wider">Assigned Marketer</label>
                  <input name="marketer" required type="text" placeholder="e.g. Sarah Connor" className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bd9dff]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#aba9bf] uppercase tracking-wider">Target Leads</label>
                  <input name="target" required type="number" min="1" placeholder="50" className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bd9dff]" />
                </div>
                <button type="submit" className="w-full mt-2 bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] py-3 rounded-xl text-[#0c0c1d] font-bold shadow-[0_0_20px_rgba(189,157,255,0.3)]">Launch Goal</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && <AddLeadModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); fetchLeads(); }} />}
      </AnimatePresence>
    </div>
  );
}
