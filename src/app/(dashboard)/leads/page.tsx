"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, CheckCircle, Mail, MoreHorizontal, X, MessageSquare, Phone, TrendingUp, User, Target, Trophy, Trash2, Edit2, Rocket } from "lucide-react";
import { useCampaignGoals, type CampaignGoal } from "@/lib/hooks/use-campaign-goals";
import { useUser } from "@/components/providers/user-provider";

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
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ company: "", contact: "", role: "", notes: "", status: "inbound" as LeadStatus });

  const handleSubmit = async () => {
    if (!form.company || !form.contact || !user) return;
    setSaving(true);
    const supabase = createClient();
    
    // Create a field visit first to link the lead
    const { data: visitData, error: visitError } = await supabase.from("field_visits").insert({
      user_id: user.id,
      company: form.company,
      contact: `${form.contact}${form.role ? `, ${form.role}` : ""}`,
      notes: form.notes,
      status: "lead",
      visit_date: new Date().toISOString()
    }).select("id").single();

    if (visitError) {
      console.error("Error creating visit for lead:", visitError);
      alert("Failed to create lead record. Please try again.");
      setSaving(false);
      return;
    }

    if (visitData) {
      const { error: leadError } = await supabase.from("leads").insert({
        visit_id: visitData.id,
        status: form.status
      });

      if (leadError) {
        console.error("Error creating lead entry:", leadError);
        alert("Failed to associate lead status. Please try again.");
      } else {
        onSave();
      }
    }
    setSaving(false);
  };

  const inputClasses = "w-full glass-panel rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] focus:outline-none transition-all placeholder:text-muted-foreground";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl relative glass-panel">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="p-8 border-b border-border/50 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center border-primary/20 bg-primary/10"><TrendingUp className="w-6 h-6 text-primary" /></div>
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground tracking-tight">Add New Lead</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Create a pipeline target.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-8 space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Company Name *</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} type="text" placeholder="Acme Corp" className={inputClasses} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Contact Name *</label>
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} type="text" placeholder="John Doe" className={inputClasses} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} type="text" placeholder="CEO" className={inputClasses} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Lead Status</label>
            <div className="flex gap-2">
              {(["inbound", "converted", "lost"] as LeadStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    form.status === s 
                    ? s === "inbound" ? "glass-panel border-primary/50 text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)] bg-primary/10" 
                      : s === "converted" ? "glass-panel border-emerald-500/50 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-500/10" 
                      : "glass-panel border-destructive/50 text-destructive shadow-[0_0_15px_rgba(244,63,94,0.2)] bg-destructive/10"
                    : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add initial contact notes..." className={`${inputClasses} min-h-[100px] resize-none`} />
          </div>
        </div>
        <div className="p-8 border-t border-border/50 bg-muted/30 relative z-10">
          <button onClick={handleSubmit} disabled={saving || !form.company || !form.contact} className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-base font-bold shadow-sm hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
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
        ${isLost ? "bg-muted/50 border-border opacity-80" : "glass-panel shadow-md hover:shadow-lg"}
        ${isConverted ? "border-emerald-500/20" : "border-border/50"}
      `}
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${
        isConverted ? "bg-emerald-500" : isLost ? "bg-destructive" : "bg-primary"
      }`} />

      <div className="flex justify-between items-start mb-3 pl-2">
        <h4 className="font-heading font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors">{lead.companyName}</h4>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted border border-border shadow-sm">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{lead.timeAgo}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 pl-2">
        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center border border-border shadow-sm">
          <User className="w-4 h-4 text-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground leading-none">{lead.contactName}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">{lead.contactRole || "Contact"}</span>
        </div>
      </div>

      {lead.notes && (
        <p className="text-xs text-muted-foreground line-clamp-2 italic mb-4 px-3 py-2 bg-muted/50 rounded-lg border border-border shadow-sm ml-2">
          "{lead.notes}"
        </p>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-border/50 pl-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground p-[1px] shadow-sm">
            <div className="w-full h-full rounded-[7px] bg-background flex items-center justify-center text-[10px] font-bold text-foreground">
              {lead.assigneeInitials}
            </div>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Assignee</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm
          ${lead.status === 'inbound' ? 'bg-primary/10 text-primary border border-primary/20' : lead.status === 'converted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-muted text-muted-foreground border border-border'}
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
          <h2 className="text-4xl font-heading font-extrabold text-foreground mb-2 tracking-tight">Lead Management</h2>
          <p className="text-muted-foreground font-medium text-base max-w-xl">Manage prospects, track conversions, and monitor street marketing campaigns.</p>
        </div>
        
        <div className="flex glass-panel p-1.5 rounded-2xl border-border/50 shadow-sm">
          <button 
            onClick={() => setActiveTab("pipeline")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "pipeline" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            Pipeline
          </button>
          <button 
            onClick={() => setActiveTab("campaigns")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "campaigns" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            <Target className="w-4 h-4" />
            Campaign Goals
          </button>
        </div>
      </div>

      {activeTab === "pipeline" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end mb-6">
            <button onClick={() => setShowModal(true)} className="px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-heading font-bold text-sm flex items-center gap-2 border border-primary/20 hover:bg-primary/20 transition-all shadow-sm">
              <Plus className="w-4 h-4" /> New Lead
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible">
            {(["inbound", "converted", "lost"] as LeadStatus[]).map((status) => {
              const colLeads = leads.filter(l => l.status === status);
              const color = status === "inbound" ? "bg-primary" : status === "converted" ? "bg-emerald-500" : "bg-destructive";
              return (
                <div key={status} className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-auto snap-center flex flex-col glass-panel rounded-[2.5rem] p-6 border-border/50 shadow-sm h-[calc(100vh-280px)] min-h-[500px]">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${color} shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
                      <h3 className="font-heading font-bold text-foreground text-xl capitalize tracking-tight">{status}</h3>
                    </div>
                    <div className="px-4 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-bold font-mono shadow-sm">
                      {colLeads.length}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar pb-4">
                    {colLeads.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-50">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-border mb-3" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No {status} leads</p>
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
            <div className="glass-panel rounded-xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-2">
                <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Active Goals</span>
                <span className="text-primary bg-primary/10 p-1.5 rounded-md"><Target className="w-4 h-4" /></span>
              </div>
              <div className="font-heading text-3xl font-extrabold text-foreground drop-shadow-sm">{goals.filter(g => g.status === 'active').length}</div>
            </div>
            <div className="glass-panel rounded-xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-2">
                <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Goals Achieved</span>
                <span className="text-emerald-500 bg-emerald-500/10 p-1.5 rounded-md"><Trophy className="w-4 h-4" /></span>
              </div>
              <div className="font-heading text-3xl font-extrabold text-foreground drop-shadow-sm">{goals.filter(g => g.status === 'achieved').length}</div>
            </div>
            <div className="flex items-center justify-center">
              <button onClick={() => setShowGoalModal(true)} className="w-full h-full min-h-[100px] rounded-xl border-2 border-dashed border-primary/50 text-primary font-bold flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary transition-all shadow-sm">
                <Rocket className="w-6 h-6" />
                Launch New Campaign
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-border/50 flex justify-between items-center bg-muted/30">
              <h2 className="font-heading text-lg font-bold text-foreground">Street Marketing Leaderboard</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider bg-muted/20">
                    <th className="py-4 px-6 font-bold">Campaign Goal</th>
                    <th className="py-4 px-6 font-bold">Assigned Marketer</th>
                    <th className="py-4 px-6 font-bold">Progress</th>
                    <th className="py-4 px-6 font-bold text-center">Status</th>
                    <th className="py-4 px-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border/30">
                  {goals.map(goal => {
                    const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                    return (
                      <tr key={goal.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors">{goal.title}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Target: {goal.target} Leads</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shadow-sm">
                              {goal.marketerName.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-foreground font-bold">{goal.marketerName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
                            <div className="flex justify-between text-[10px] font-bold font-mono">
                              <span className="text-primary">{goal.current} achieved</span>
                              <span className="text-muted-foreground">{percent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                              <div className={`h-full rounded-full transition-all duration-1000 ${percent === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-primary'}`} style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {goal.status === 'achieved' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 shadow-sm"><Trophy className="w-3 h-3" /> Achieved</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 shadow-sm"><Rocket className="w-3 h-3" /> Active</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {goal.status !== 'achieved' && (
                              <button onClick={() => handleUpdateGoal(goal.id, goal.current + 1)} className="px-2 py-1 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary text-xs font-bold rounded transition-colors border border-transparent hover:border-primary/20 shadow-sm">
                                +1 Lead
                              </button>
                            )}
                            <button onClick={() => deleteGoal(goal.id)} className="p-1.5 text-muted-foreground hover:text-destructive bg-muted hover:bg-destructive/10 rounded transition-colors shadow-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {goals.length === 0 && (
                    <tr><td colSpan={5} className="py-12 text-center text-muted-foreground font-bold">No campaign goals active.</td></tr>
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
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed bottom-6 right-6 z-[100] bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/50 p-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center gap-3 max-w-sm">
            <div className="p-2 bg-emerald-500 rounded-xl text-primary-foreground"><Trophy className="w-6 h-6" /></div>
            <p className="text-sm font-bold text-foreground drop-shadow-sm">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xl font-bold font-heading text-foreground flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Setup Campaign Goal</h3>
                <button onClick={() => setShowGoalModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
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
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Goal Title</label>
                  <input name="title" required type="text" placeholder="e.g. Summer Promo Street Leads" className="mt-1 w-full glass-panel border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Marketer</label>
                  <input name="marketer" required type="text" placeholder="e.g. Sarah Connor" className="mt-1 w-full glass-panel border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Leads</label>
                  <input name="target" required type="number" min="1" placeholder="50" className="mt-1 w-full glass-panel border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
                </div>
                <button type="submit" className="w-full mt-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-shadow">Launch Goal</button>
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
