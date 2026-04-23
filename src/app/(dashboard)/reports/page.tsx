"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, ChevronDown, BarChart2, FileText, Download, 
  TrendingUp, TrendingDown, Users, Search, Filter, ArrowRight, ExternalLink
} from "lucide-react";

// --- Types ---
interface Sale {
  id: string;
  customer: string;
  service: string;
  price: number;
  sale_date: string;
  user_id: string;
  users?: { id: string; name: string };
}

interface Visit {
  id: string;
  company: string;
  contact: string;
  visit_date: string;
  status: string;
  user_id: string;
  users?: { id: string; name: string };
}

// --- Utils ---
function exportCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar" | "records">("dashboard");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const supabase = createClient();
      
      const { data: salesData } = await supabase.from("sales").select("*, users(id, name)");
      const { data: visitsData } = await supabase.from("field_visits").select("*, users(id, name)");
      
      if (salesData) setSales(salesData);
      if (visitsData) setVisits(visitsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  // --- Derived State ---
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchesUser = !selectedUser || s.user_id === selectedUser;
      const matchesSearch = !searchQuery || s.customer.toLowerCase().includes(searchQuery.toLowerCase()) || s.service.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesUser && matchesSearch;
    });
  }, [sales, selectedUser, searchQuery]);

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      const matchesUser = !selectedUser || v.user_id === selectedUser;
      const matchesSearch = !searchQuery || v.company.toLowerCase().includes(searchQuery.toLowerCase()) || v.contact.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesUser && matchesSearch;
    });
  }, [visits, selectedUser, searchQuery]);

  const stats = useMemo(() => {
    const rev = filteredSales.reduce((acc, s) => acc + Number(s.price), 0);
    const count = filteredSales.length;
    const visitCount = filteredVisits.length;
    
    const agentMap = new Map();
    sales.forEach(s => {
      if (s.users) {
        const current = agentMap.get(s.users.id) || { name: s.users.name, rev: 0, count: 0 };
        agentMap.set(s.users.id, { ...current, rev: current.rev + Number(s.price), count: current.count + 1 });
      }
    });
    const topAgents = Array.from(agentMap.values()).sort((a, b) => b.rev - a.rev);

    return { rev, count, visitCount, topAgents };
  }, [filteredSales, filteredVisits, sales]);

  const handleExport = () => {
    const dataToExport = activeTab === "records" || activeTab === "dashboard" 
      ? filteredSales.map(s => ({
          Date: formatDate(s.sale_date),
          Customer: s.customer,
          Service: s.service,
          Amount: s.price,
          Agent: s.users?.name || "Unknown"
        }))
      : filteredVisits.map(v => ({
          Date: formatDate(v.visit_date),
          Company: v.company,
          Contact: v.contact,
          Status: v.status,
          Agent: v.users?.name || "Unknown"
        }));

    exportCSV(dataToExport, `marketpro-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // --- Chart Logic ---
  const chartData = useMemo(() => {
    const buckets = Array(7).fill(0); // Last 7 days
    const now = new Date();
    filteredSales.forEach(s => {
      const d = new Date(s.sale_date);
      const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 7) buckets[6 - diff] += Number(s.price);
    });
    const max = Math.max(...buckets, 100);
    return buckets.map((val, i) => ({ val, max, label: `D${i+1}` }));
  }, [filteredSales]);

  const polyPoints = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * 100;
    const y = 100 - ((d.val / d.max) * 80);
    return `${x},${y}`;
  });
  const pathData = `M${polyPoints.join(" L")}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 lg:p-8 relative z-10 min-h-screen">
      {/* Liquid Light Orbs (Background Glows) */}
      <div className="fixed top-0 right-[20%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-[100px] opacity-20 bg-gradient-to-br from-[#bd9dff] to-[#53ddfc]" />
      <div className="fixed bottom-0 left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[120px] opacity-10 bg-gradient-to-tr from-[#53ddfc] to-[#bd9dff]" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-[#e6e3fb] tracking-tight mb-2">Performance Reports</h2>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`text-sm font-medium transition-colors ${activeTab === "dashboard" ? "text-[#bd9dff]" : "text-[#aba9bf] hover:text-[#e6e3fb]"}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`text-sm font-medium transition-colors ${activeTab === "calendar" ? "text-[#bd9dff]" : "text-[#aba9bf] hover:text-[#e6e3fb]"}`}
            >
              Calendar Report
            </button>
            <button 
              onClick={() => setActiveTab("records")}
              className={`text-sm font-medium transition-colors ${activeTab === "records" ? "text-[#bd9dff]" : "text-[#aba9bf] hover:text-[#e6e3fb]"}`}
            >
              Data Records
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 p-2 rounded-xl">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9bf]" />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111124] border border-[#474659]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#e6e3fb] focus:outline-none focus:border-[#bd9dff]/50 w-48"
            />
          </div>
          <button onClick={handleExport} className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-4 py-2 rounded-lg text-sm text-black flex items-center gap-2 font-medium">
            <Download className="w-4 h-4" /> Export Filtered
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#bd9dff] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === "dashboard" && (
            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
              {/* Summary Cards - Bento Style */}
              <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Revenue", val: `$${stats.rev.toLocaleString()}`, icon: TrendingUp, color: "#bd9dff", glow: "rgba(189,157,255,0.4)", gradient: "from-[#bd9dff]/10 to-transparent" },
                  { label: "Sales Closed", val: stats.count, icon: BarChart2, color: "#53ddfc", glow: "rgba(83,221,252,0.4)", gradient: "from-[#53ddfc]/10 to-transparent" },
                  { label: "Field Visits", val: stats.visitCount, icon: Users, color: "#e6e3fb", glow: "rgba(255,255,255,0.2)", gradient: "from-white/10 to-transparent" },
                ].map((s, i) => (
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} key={i} className="group relative bg-[#111124]/60 backdrop-blur-3xl border border-[#474659]/30 rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300" style={{ boxShadow: `0 4px 30px rgba(0,0,0,0.1)` }}>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `0 0 30px ${s.glow}` }} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    
                    <div className="relative z-10 p-4 rounded-xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      <s.icon className="w-8 h-8" style={{ color: s.color, filter: `drop-shadow(0 0 10px ${s.glow})` }} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] text-[#aba9bf] uppercase tracking-widest font-bold mb-1">{s.label}</p>
                      <h4 className="text-3xl font-heading font-extrabold text-white" style={{ textShadow: `0 0 20px ${s.glow}` }}>{s.val}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-8 group relative bg-[#111124]/60 backdrop-blur-3xl border border-[#474659]/30 rounded-2xl p-6 lg:p-8 hover:border-[#bd9dff]/30 transition-colors duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(189,157,255,0.1)]">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white tracking-tight flex items-center gap-2">Revenue Velocity <span className="text-xs bg-[#bd9dff]/20 text-[#bd9dff] px-2 py-0.5 rounded-full border border-[#bd9dff]/30">7 Days</span></h3>
                    <p className="text-sm text-[#aba9bf] mt-1">Interactive velocity tracking. Click data points to drill down.</p>
                  </div>
                </div>
                <div className="h-64 w-full relative z-10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d={`${pathData} L100,100 L0,100 Z`} fill="url(#grad2)" opacity="0.3" />
                    <path d={pathData} fill="none" stroke="#bd9dff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0 0 8px rgba(189,157,255,0.8))" }} />
                    <defs>
                      <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bd9dff"/><stop offset="100%" stopColor="#bd9dff" stopOpacity="0"/></linearGradient>
                    </defs>
                    {polyPoints.map((p, i) => {
                      const [x, y] = p.split(",");
                      return (
                        <motion.circle 
                          whileHover={{ scale: 2 }}
                          key={i} cx={x} cy={y} r="2.5" 
                          fill="#ffffff" className="cursor-pointer origin-center shadow-[0_0_10px_#fff]"
                          onClick={() => { setActiveTab("records"); }}
                        />
                      );
                    })}
                  </svg>
                </div>
              </motion.div>

              {/* Top Performers */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-4 bg-[#111124]/60 backdrop-blur-3xl border border-[#474659]/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <h3 className="font-heading text-lg font-bold text-white mb-6 tracking-tight flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#53ddfc]"/> Top Performers</h3>
                <div className="space-y-4">
                  {stats.topAgents.length === 0 ? <p className="text-sm text-[#aba9bf]">No data yet.</p> :
                    stats.topAgents.map((emp: any, i: number) => {
                      const max = stats.topAgents[0].rev;
                      const p = Math.max((emp.rev / max) * 100, 5);
                      return (
                        <div 
                          key={i} 
                          className={`cursor-pointer group p-3 rounded-xl border transition-all duration-300 ${selectedUser === emp.id ? 'bg-[#bd9dff]/10 border-[#bd9dff]/30 shadow-[0_0_15px_rgba(189,157,255,0.2)]' : 'bg-black/20 border-transparent hover:bg-white/5 hover:border-white/10'}`}
                          onClick={() => setSelectedUser(selectedUser === emp.id ? null : emp.id)}
                        >
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span className="font-bold text-[#e6e3fb] group-hover:text-white transition-colors flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] flex items-center justify-center text-[10px] text-[#0c0c1d]">{i+1}</div>
                              {emp.name}
                            </span>
                            <span className="font-mono font-bold text-[#53ddfc]" style={{ textShadow: "0 0 10px rgba(83,221,252,0.4)" }}>${emp.rev.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#23233b] rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${p}%` }}
                              className="h-full bg-gradient-to-r from-[#bd9dff] to-[#53ddfc] shadow-[0_0_10px_rgba(83,221,252,0.8)]" 
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <div className="bg-white/[0.06] border border-[#474659]/30 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-lg font-bold text-[#e6e3fb]">Activity Calendar</h3>
                <span className="text-sm text-[#aba9bf]">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[10px] text-[#aba9bf] uppercase font-bold py-2">{d}</div>
                ))}
                {/* Pad days before start of month */}
                {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square opacity-0" />
                ))}
                {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const daySales = filteredSales.filter(s => {
                    const d = new Date(s.sale_date);
                    return d.getDate() === day && d.getMonth() === new Date().getMonth();
                  }).length;
                  const dayVisits = filteredVisits.filter(v => {
                    const d = new Date(v.visit_date);
                    return d.getDate() === day && d.getMonth() === new Date().getMonth();
                  }).length;
                  const intensity = Math.min((daySales + dayVisits) * 0.2, 1);
                  
                  return (
                    <div 
                      key={i} 
                      className="aspect-square bg-[#111124] border border-[#474659]/10 rounded-lg p-2 flex flex-col justify-between hover:border-[#bd9dff]/30 transition-colors cursor-pointer relative overflow-hidden"
                      onClick={() => { setActiveTab("records"); }}
                    >
                      <span className="text-xs text-[#aba9bf] z-10">{day}</span>
                      <div className="flex gap-1 z-10">
                        {daySales > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#bd9dff]" title={`${daySales} Sales`} />}
                        {dayVisits > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#53ddfc]" title={`${dayVisits} Visits`} />}
                      </div>
                      {intensity > 0 && (
                        <div 
                          className="absolute inset-0 bg-[#bd9dff]/10 pointer-events-none" 
                          style={{ opacity: intensity }} 
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "records" && (
            <div className="bg-white/[0.06] border border-[#474659]/30 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#474659]/30 flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-[#e6e3fb]">Detailed Records</h3>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-[#bd9dff]/20 text-[#bd9dff] rounded border border-[#bd9dff]/30">
                    {filteredSales.length} Sales
                  </span>
                  <span className="text-xs px-2 py-1 bg-[#53ddfc]/20 text-[#53ddfc] rounded border border-[#53ddfc]/30">
                    {filteredVisits.length} Visits
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.03] text-[10px] text-[#aba9bf] uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Entity / Customer</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Status / Service</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Agent</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#474659]/10">
                    {filteredSales.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 text-[#aba9bf]">{formatDate(s.sale_date)}</td>
                        <td className="px-6 py-4 text-[#e6e3fb] font-medium">{s.customer}</td>
                        <td className="px-6 py-4"><span className="text-[10px] bg-[#bd9dff]/10 text-[#bd9dff] px-2 py-0.5 rounded border border-[#bd9dff]/20">SALE</span></td>
                        <td className="px-6 py-4 text-[#aba9bf]">{s.service}</td>
                        <td className="px-6 py-4 text-[#bd9dff] font-bold">${s.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#e6e3fb]">{s.users?.name}</td>
                      </tr>
                    ))}
                    {filteredVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 text-[#aba9bf]">{formatDate(v.visit_date)}</td>
                        <td className="px-6 py-4 text-[#e6e3fb] font-medium">{v.company}</td>
                        <td className="px-6 py-4"><span className="text-[10px] bg-[#53ddfc]/10 text-[#53ddfc] px-2 py-0.5 rounded border border-[#53ddfc]/20">VISIT</span></td>
                        <td className="px-6 py-4 text-[#aba9bf]">{v.status}</td>
                        <td className="px-6 py-4 text-[#aba9bf]">-</td>
                        <td className="px-6 py-4 text-[#e6e3fb]">{v.users?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
