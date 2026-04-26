"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, ChevronDown, BarChart2, FileText, Download, 
  TrendingUp, TrendingDown, Users, Search, Filter, ArrowRight, ExternalLink, Printer, X
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

function exportWordDoc(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>MarketPro Report</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #09090b; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th, td { border: 1px solid #e4e4e7; text-align: left; padding: 10px; font-size: 14px; }
      th { background-color: #f4f4f5; font-weight: bold; }
      h1 { font-size: 24px; margin-bottom: 5px; }
      h2 { font-size: 16px; color: #71717a; margin-top: 0; }
      h3 { font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #e4e4e7; padding-bottom: 5px; }
      .metrics { margin-bottom: 30px; }
    </style></head><body>`;
  
  const footer = "</body></html>";
  // Clean up any unnecessary UI elements from HTML before exporting
  const clone = element.cloneNode(true) as HTMLElement;
  const html = header + clone.innerHTML + footer;
  
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);

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
  const isWithinDateRange = (dateStr: string) => {
    if (!dateFrom && !dateTo) return true;
    const d = new Date(dateStr).getTime();
    const from = dateFrom ? new Date(dateFrom).getTime() : -Infinity;
    const to = dateTo ? new Date(dateTo).getTime() + 86400000 - 1 : Infinity;
    return d >= from && d <= to;
  };

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchesUser = !selectedUser || s.user_id === selectedUser;
      const matchesSearch = !searchQuery || s.customer.toLowerCase().includes(searchQuery.toLowerCase()) || s.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = isWithinDateRange(s.sale_date);
      return matchesUser && matchesSearch && matchesDate;
    });
  }, [sales, selectedUser, searchQuery, dateFrom, dateTo]);

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      const matchesUser = !selectedUser || v.user_id === selectedUser;
      const matchesSearch = !searchQuery || v.company.toLowerCase().includes(searchQuery.toLowerCase()) || v.contact.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = isWithinDateRange(v.visit_date);
      return matchesUser && matchesSearch && matchesDate;
    });
  }, [visits, selectedUser, searchQuery, dateFrom, dateTo]);

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

  const inputClasses = "bg-white/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-sm [color-scheme:light]";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 lg:p-8 relative z-10 min-h-screen">
      {/* Print styles applied dynamically */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          
          .print-modal-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            transform: none !important;
          }

          .print-modal-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }

          #print-section, #print-section * { visibility: visible; }
          #print-section { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            background: white !important; 
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}} />
      {/* Liquid Light Orbs (Background Glows) */}
      <div className="fixed top-0 right-[20%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-[80px] opacity-30 bg-primary/20 text-white will-change-transform transform-gpu" />
      <div className="fixed bottom-0 left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[80px] opacity-20 bg-gradient-to-tr from-accent/20 to-primary/10 will-change-transform transform-gpu" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight mb-2 drop-shadow-sm">Performance Reports</h2>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`text-sm font-medium transition-colors ${activeTab === "dashboard" ? "text-primary font-bold drop-shadow-sm" : "text-muted-foreground hover:text-primary"}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`text-sm font-medium transition-colors ${activeTab === "calendar" ? "text-primary font-bold drop-shadow-sm" : "text-muted-foreground hover:text-primary"}`}
            >
              Calendar Report
            </button>
            <button 
              onClick={() => setActiveTab("records")}
              className={`text-sm font-medium transition-colors ${activeTab === "records" ? "text-primary font-bold drop-shadow-sm" : "text-muted-foreground hover:text-primary"}`}
            >
              Data Records
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 glass-panel p-2 rounded-xl">
            <div className="flex items-center gap-2 border-r border-border/50 pr-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider ml-1">From:</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={inputClasses} />
            </div>
            <div className="flex items-center gap-2 border-r border-border/50 pr-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider ml-1">To:</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={inputClasses} />
            </div>
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(""); setDateTo(""); }} className="text-xs text-destructive hover:text-red-700 font-medium px-2 flex items-center">
                Clear Dates
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 glass-panel p-2 rounded-xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search records..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/50 border border-border/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 w-48 transition-all backdrop-blur-sm"
              />
            </div>
            <button onClick={() => setShowPrintModal(true)} className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-colors shadow-sm">
              <FileText className="w-4 h-4" /> Export Report
            </button>
            <button onClick={() => setShowPrintModal(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-all">
              <Printer className="w-4 h-4" /> Print PDF
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === "dashboard" && (
            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
              {/* Summary Cards - Bento Style */}
              <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Revenue", val: `$${stats.rev.toLocaleString('en-US')}`, icon: TrendingUp, color: "#6366F1", glow: "rgba(99,102,241,0.4)", gradient: "from-primary/10 to-transparent" },
                  { label: "Sales Closed", val: stats.count, icon: BarChart2, color: "#818CF8", glow: "rgba(129,140,248,0.4)", gradient: "from-secondary/10 to-transparent" },
                  { label: "Field Visits", val: stats.visitCount, icon: Users, color: "#10B981", glow: "rgba(16,185,129,0.4)", gradient: "from-accent/10 to-transparent" },
                ].map((s, i) => (
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} key={i} className="group relative glass-panel rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `0 0 30px ${s.glow}` }} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    
                    <div className="relative z-10 p-4 rounded-xl bg-white/50 border border-white/60 group-hover:scale-110 transition-transform duration-300 shadow-sm backdrop-blur-sm">
                      <s.icon className="w-8 h-8" style={{ color: s.color, filter: `drop-shadow(0 0 10px ${s.glow})` }} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{s.label}</p>
                      <h4 className="text-3xl font-heading font-extrabold text-foreground drop-shadow-sm">{s.val}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-8 group relative glass-panel rounded-2xl p-6 lg:p-8 hover:border-primary/20 transition-colors duration-500 shadow-sm hover:shadow-md">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground tracking-tight flex items-center gap-2">Revenue Velocity <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">7 Days</span></h3>
                    <p className="text-sm text-muted-foreground mt-1">Interactive velocity tracking. Click data points to drill down.</p>
                  </div>
                </div>
                <div className="h-64 w-full relative z-10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Grid Lines */}
                    {[20, 40, 60, 80].map(y => (
                      <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    ))}
                    {chartData.map((_, i) => (
                      <line key={i} x1={(i / (chartData.length - 1)) * 100} y1="0" x2={(i / (chartData.length - 1)) * 100} y2="100" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    ))}

                    <path d={`${pathData} L100,100 L0,100 Z`} fill="url(#grad2)" opacity="0.4" />
                    <path d={pathData} fill="none" stroke="#4F46E5" strokeWidth="4" vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0 4px 12px rgba(79,70,229,0.5))" }} />
                    <defs>
                      <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F46E5"/><stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/></linearGradient>
                    </defs>
                    {polyPoints.map((p, i) => {
                      const [x, y] = p.split(",");
                      return (
                        <g key={i} className="group/point cursor-pointer">
                          <motion.circle 
                            whileHover={{ r: 6 }}
                            cx={x} cy={y} r="4" 
                            fill="#4F46E5" stroke="#ffffff" strokeWidth="2" className="origin-center shadow-lg"
                            onClick={() => { setActiveTab("records"); }}
                          />
                          <text x={x} y={parseFloat(y) - 8} textAnchor="middle" className="text-[4px] font-bold fill-primary opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none">
                            ${chartData[i].val.toLocaleString('en-US')}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </motion.div>

              {/* Top Performers */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-4 glass-panel rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-foreground mb-6 tracking-tight flex items-center gap-2"><ArrowRight className="w-4 h-4 text-primary"/> Top Performers</h3>
                <div className="space-y-4">
                  {stats.topAgents.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> :
                    stats.topAgents.map((emp: { name: string; rev: number; count: number; id: string }, i: number) => {
                      const max = stats.topAgents[0].rev;
                      const p = Math.max((emp.rev / max) * 100, 5);
                      return (
                        <div 
                          key={i} 
                          className={`cursor-pointer group p-3 rounded-xl border transition-all duration-300 ${selectedUser === emp.id ? 'bg-primary/10 border-primary/20 shadow-sm' : 'bg-white/30 border-transparent hover:bg-primary/5 hover:border-primary/20'}`}
                          onClick={() => setSelectedUser(selectedUser === emp.id ? null : emp.id)}
                        >
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px] shadow-sm">{i+1}</div>
                              {emp.name}
                            </span>
                            <span className="font-mono font-bold text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">${emp.rev.toLocaleString('en-US')}</span>
                          </div>
                          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${p}%` }}
                              className="h-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
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
            <div className="glass-panel rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-lg font-bold text-foreground">Activity Calendar</h3>
                <span className="text-sm text-muted-foreground font-medium">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[10px] text-muted-foreground uppercase font-bold py-2">{d}</div>
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
                      className="aspect-square bg-white/40 border border-border/50 rounded-lg p-2 flex flex-col justify-between hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden backdrop-blur-sm"
                      onClick={() => { setActiveTab("records"); }}
                    >
                      <span className="text-xs text-foreground z-10 font-medium">{day}</span>
                      <div className="flex gap-1 z-10">
                        {daySales > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary" title={`${daySales} Sales`} />}
                        {dayVisits > 0 && <div className="w-1.5 h-1.5 rounded-full bg-accent" title={`${dayVisits} Visits`} />}
                      </div>
                      {intensity > 0 && (
                        <div 
                          className="absolute inset-0 bg-primary/10 pointer-events-none" 
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
            <div className="glass-panel rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-foreground">Detailed Records</h3>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary font-bold rounded border border-primary/20 shadow-sm">
                    {filteredSales.length} Sales
                  </span>
                  <span className="text-xs px-2 py-1 bg-accent/10 text-accent font-bold rounded border border-accent/20 shadow-sm">
                    {filteredVisits.length} Visits
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-primary/5 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Entity / Customer</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Status / Service</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Agent</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-border/30">
                    {filteredSales.map((s) => (
                      <tr key={s.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 text-muted-foreground">{formatDate(s.sale_date)}</td>
                        <td className="px-6 py-4 text-foreground font-medium">{s.customer}</td>
                        <td className="px-6 py-4"><span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 font-bold tracking-wider shadow-sm">SALE</span></td>
                        <td className="px-6 py-4 text-muted-foreground">{s.service}</td>
                        <td className="px-6 py-4 text-primary font-bold drop-shadow-sm">${s.price.toLocaleString('en-US')}</td>
                        <td className="px-6 py-4 text-foreground">{s.users?.name}</td>
                      </tr>
                    ))}
                    {filteredVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 text-muted-foreground">{formatDate(v.visit_date)}</td>
                        <td className="px-6 py-4 text-foreground font-medium">{v.company}</td>
                        <td className="px-6 py-4"><span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 font-bold tracking-wider shadow-sm">VISIT</span></td>
                        <td className="px-6 py-4 text-muted-foreground">{v.status}</td>
                        <td className="px-6 py-4 text-muted-foreground">-</td>
                        <td className="px-6 py-4 text-foreground">{v.users?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm no-print print-modal-wrapper">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border print-modal-content"
            >
              {/* Modal Header (No print) */}
              <div className="flex justify-between items-center p-6 border-b border-border bg-muted/50 backdrop-blur-md no-print">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">Document Generator</h3>
                  <p className="text-sm text-muted-foreground">Preview your report before saving or printing.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => exportWordDoc("print-section", `MarketPro_Report_${new Date().toISOString().split('T')[0]}.doc`)} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 font-bold transition-all"
                  >
                    <FileText className="w-4 h-4" /> Download Word Doc
                  </button>
                  <button onClick={() => window.print()} className="bg-background border border-border text-foreground hover:bg-muted px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 font-bold transition-all shadow-sm">
                    <Printer className="w-4 h-4" /> Print / Save as PDF
                  </button>
                  <button onClick={() => setShowPrintModal(false)} className="bg-background border border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive px-3 py-2.5 rounded-lg transition-colors shadow-sm">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Area */}
              <div id="print-section" className="p-10 overflow-y-auto flex-1 bg-white">
                <div className="mb-8 border-b border-[#09090b] pb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-extrabold font-heading text-[#09090b] tracking-tight">MARKETPRO</h1>
                    <h2 className="text-lg font-bold text-[#71717a] uppercase tracking-widest mt-1">Official Performance Report</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#09090b] font-medium">Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-[#71717a]">
                      Period: {dateFrom ? formatDate(dateFrom) : "All Time"} - {dateTo ? formatDate(dateTo) : "Present"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="p-4 border border-[#e4e4e7] rounded-xl bg-[#f4f4f5]">
                    <p className="text-xs text-[#71717a] font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#09090b] font-mono">${stats.rev.toLocaleString('en-US')}</p>
                  </div>
                  <div className="p-4 border border-[#e4e4e7] rounded-xl bg-[#f4f4f5]">
                    <p className="text-xs text-[#71717a] font-bold uppercase tracking-wider mb-1">Total Sales</p>
                    <p className="text-2xl font-bold text-[#09090b]">{stats.count} Deals</p>
                  </div>
                  <div className="p-4 border border-[#e4e4e7] rounded-xl bg-[#f4f4f5]">
                    <p className="text-xs text-[#71717a] font-bold uppercase tracking-wider mb-1">Total Field Visits</p>
                    <p className="text-2xl font-bold text-[#09090b]">{stats.visitCount} Visits</p>
                  </div>
                </div>

                {filteredSales.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-[#09090b] mb-4 border-b border-[#e4e4e7] pb-2">Sales Transactions</h3>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b-2 border-[#09090b]">
                          <th className="py-2 font-bold text-[#09090b]">Date</th>
                          <th className="py-2 font-bold text-[#09090b]">Customer</th>
                          <th className="py-2 font-bold text-[#09090b]">Service</th>
                          <th className="py-2 font-bold text-[#09090b]">Agent</th>
                          <th className="py-2 font-bold text-[#09090b] text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e4e4e7]">
                        {filteredSales.map(s => (
                          <tr key={s.id}>
                            <td className="py-2 text-[#27272a]">{formatDate(s.sale_date)}</td>
                            <td className="py-2 font-medium text-[#09090b]">{s.customer}</td>
                            <td className="py-2 text-[#71717a]">{s.service}</td>
                            <td className="py-2 text-[#71717a]">{s.users?.name}</td>
                            <td className="py-2 font-mono font-medium text-[#09090b] text-right">${s.price.toLocaleString('en-US')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {filteredVisits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[#09090b] mb-4 border-b border-[#e4e4e7] pb-2">Field Visits</h3>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b-2 border-[#09090b]">
                          <th className="py-2 font-bold text-[#09090b]">Date</th>
                          <th className="py-2 font-bold text-[#09090b]">Company</th>
                          <th className="py-2 font-bold text-[#09090b]">Contact</th>
                          <th className="py-2 font-bold text-[#09090b]">Status</th>
                          <th className="py-2 font-bold text-[#09090b]">Agent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e4e4e7]">
                        {filteredVisits.map(v => (
                          <tr key={v.id}>
                            <td className="py-2 text-[#27272a]">{formatDate(v.visit_date)}</td>
                            <td className="py-2 font-medium text-[#09090b]">{v.company}</td>
                            <td className="py-2 text-[#71717a]">{v.contact}</td>
                            <td className="py-2 text-[#71717a]">{v.status}</td>
                            <td className="py-2 text-[#71717a]">{v.users?.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-[#e4e4e7] text-center">
                  <p className="text-xs text-[#71717a] font-medium">*** END OF REPORT ***</p>
                  <p className="text-[10px] text-[#a1a1aa] mt-2">Generated by MarketPro Admin Dashboard</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
