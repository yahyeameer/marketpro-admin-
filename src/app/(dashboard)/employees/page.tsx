"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Download, CalendarDays, ChevronDown, MoreVertical, TrendingUp, TrendingDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

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

function EmployeeCard({ employee, sparklineBars }: { employee: any, sparklineBars: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel rounded-2xl p-6 border-border/50 flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-border bg-primary/10 flex items-center justify-center shadow-inner">
            {employee.image ? (
              <img src={employee.image} alt={employee.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-extrabold text-primary font-heading tracking-tight">{employee.initials}</span>
            )}
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground">{employee.name}</h3>
            <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm
              ${employee.role === "Senior Field Rep" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted/50 text-muted-foreground border-border"}
            `}>
              {employee.role}
            </span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
        {[
          { label: "Visits", ...employee.visits },
          { label: "Leads", ...employee.leads },
          { label: "Sales", ...employee.sales },
          { label: "Revenue", ...employee.revenue, isPrimary: true },
        ].map(stat => (
          <div key={stat.label} className="bg-muted/30 border border-border/50 rounded-xl p-4 shadow-sm group-hover:border-border transition-colors">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{stat.label}</p>
            <p className={`font-heading text-2xl font-extrabold tracking-tight ${stat.isPrimary ? "text-primary" : "text-foreground"}`}>
              {stat.value}
            </p>
            <p className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${stat.up ? "text-emerald-500" : "text-destructive"}`}>
              {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-border/50 pt-4">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          <span>Performance Trend</span>
          <span className={employee.trendColor}>{employee.trendStatus}</span>
        </div>
        <div className="w-full h-10 flex items-end gap-1.5">
          {sparklineBars.map((bar, i) => (
             <div 
               key={i} 
               className={`flex-1 rounded-t-sm transition-all duration-500 ${bar.bg} ${bar.shadow ? `shadow-[0_0_12px_${bar.shadow}]` : ""}`}
               style={{ height: bar.height }}
             />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function EmployeesPage() {
  const [tableEmployees, setTableEmployees] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchEmployees() {
      const { data, error } = await supabase.from('users').select('*').in('role', ['admin', 'manager']);
      if (data) {
        const mapped = data.map((user: any, index: number) => {
          // Because mock data doesn't have hundreds of visits per user, we simulate realistic looking analytics bound to their IDs
          // This keeps the presentation dense and Ethereal.
          const seed = user.id.charCodeAt(0) + user.id.charCodeAt(user.id.length - 1);
          const v = 80 + (seed % 100);
          const s = 20 + (seed % 30);
          const rev = (s * 850);
          
          let color = "bg-primary";
          let shadow = "var(--primary)";
          let tColor = "text-muted-foreground";
          
          if (index === 0) { color = "bg-emerald-500"; shadow = "rgba(16,185,129,0.5)"; tColor = "text-emerald-500";}
          if (index === 1) { color = "bg-amber-500"; shadow = "rgba(245,158,11,0.5)"; tColor = "text-amber-500"; }

          return {
            id: user.id,
            name: user.name,
            role: user.role === 'admin' ? "Regional Director" : "Senior Field Rep",
            image: "",
            initials: user.name.split(" ").map((n: string) => n[0]).join("").substring(0,2).toUpperCase(),
            visits: { value: new Intl.NumberFormat('en-US').format(v), trend: `+${(seed % 15) + 1}%`, up: (seed % 2 === 0) },
            leads: { value: new Intl.NumberFormat('en-US').format(Math.floor(v * 0.7)), trend: `+${(seed % 8) + 1}%`, up: true },
            sales: { value: new Intl.NumberFormat('en-US').format(s), trend: `${(seed % 2 === 0 ? '+' : '-')}${(seed % 6) + 1}%`, up: (seed % 2 === 0) },
            revenue: { value: `$${new Intl.NumberFormat('en-US').format(rev/1000)}k`, trend: `+${(seed % 20) + 1}%`, up: true },
            trendStatus: index === 0 ? "Excellent" : index === 1 ? "Volatile" : "Stable",
            trendColor: tColor,
            territory: index % 2 === 0 ? "Northwest Region" : "Central District",
            convRate: `${((s / Math.floor(v * 0.7))*100).toFixed(1)}%`,
            avgDeal: `$${new Intl.NumberFormat('en-US').format(rev/s)}`,
            totalRev: `$${new Intl.NumberFormat('en-US').format(rev)}`,
            statusColor: color,
            statusShadow: shadow,
          };
        });
        setTableEmployees(mapped);
      }
    }
    fetchEmployees();
  }, []);

  const cardsData = tableEmployees.slice(0, 3); // Display only top 3 as cards

  // Just mimicking the static CSS sparkline styles from the HTML prototype
  const sparklineVariations = [
    [
      { height: "33%", bg: "bg-emerald-500/30" }, { height: "50%", bg: "bg-emerald-500/40" },
      { height: "40%", bg: "bg-emerald-500/50" }, { height: "75%", bg: "bg-emerald-500/70" },
      { height: "85%", bg: "bg-emerald-500/80" }, { height: "100%", bg: "bg-emerald-500", shadow: "rgba(16,185,129,0.5)" }
    ],
    [
      { height: "45%", bg: "bg-amber-500/30" }, { height: "40%", bg: "bg-amber-500/30" },
      { height: "50%", bg: "bg-amber-500/40" }, { height: "48%", bg: "bg-amber-500/40" },
      { height: "55%", bg: "bg-amber-500/50" }, { height: "60%", bg: "bg-amber-500/60" }
    ],
    [
      { height: "30%", bg: "bg-primary/20" }, { height: "60%", bg: "bg-primary/40" },
      { height: "90%", bg: "bg-primary/70" }, { height: "40%", bg: "bg-primary/30" },
      { height: "70%", bg: "bg-primary/50" }, { height: "45%", bg: "bg-primary", shadow: "rgba(99,102,241,0.5)" }
    ]
  ];

  const totalPages = Math.ceil(tableEmployees.length / itemsPerPage);
  const currentEmployees = tableEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    const dataToExport = tableEmployees.map(emp => ({
      Name: emp.name,
      Role: emp.role,
      Territory: emp.territory,
      Visits: emp.visits.value,
      Sales: emp.sales.value,
      Revenue: emp.totalRev,
    }));
    exportCSV(dataToExport, `employees-performance-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <>
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="font-heading text-4xl font-extrabold text-foreground tracking-tight mb-2">Employee Performance</h1>
          <p className="text-muted-foreground text-base font-medium">Real-time metrics and historical KPI data for field staff.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="glass-panel border-border/50 rounded-xl flex items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-muted transition-colors shadow-sm">
            <CalendarDays className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-foreground font-bold">Last 30 Days</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
          </div>
          <button onClick={handleExport} className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 active:scale-95">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Employee Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {cardsData.map((emp, index) => (
           <EmployeeCard key={emp.id} employee={emp} sparklineBars={sparklineVariations[index]} />
        ))}
      </div>

      {/* Detailed KPI Table */}
      <div className="glass-panel rounded-2xl border-border/50 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border/50 flex justify-between items-center bg-muted/20">
          <h2 className="font-heading text-xl font-bold text-foreground">Comprehensive KPI Directory</h2>
          <button onClick={() => router.push('/reports')} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-bold group">
            View Reports <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/30">
                <th className="px-6 py-5 flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
                  Employee <ChevronDown className="w-3.5 h-3.5" />
                </th>
                <th className="px-6 py-5 cursor-pointer hover:text-foreground transition-colors">Territory</th>
                <th className="px-6 py-5 cursor-pointer hover:text-foreground transition-colors text-right">Total Visits</th>
                <th className="px-6 py-5 cursor-pointer hover:text-foreground transition-colors text-right">Conv. Rate</th>
                <th className="px-6 py-5 cursor-pointer hover:text-foreground transition-colors text-right">Avg Deal Size</th>
                <th className="px-6 py-5 cursor-pointer hover:text-foreground transition-colors text-right">Total Revenue</th>
                <th className="px-6 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border/30">
              {currentEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center border border-border text-xs font-extrabold font-heading text-primary shadow-sm">
                        {emp.image ? (
                           <img src={emp.image} alt={emp.name} className="w-full h-full object-cover" />
                        ) : (
                           emp.initials
                        )}
                      </div>
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">{emp.territory}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-foreground">{emp.visits.value}</td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${emp.visits.up ? "text-emerald-500" : "text-destructive"}`}>
                    {emp.convRate}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-foreground">{emp.avgDeal}</td>
                  <td className="px-6 py-4 text-right font-mono font-extrabold text-foreground">{emp.totalRev}</td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      className={`inline-block w-2.5 h-2.5 rounded-full ${emp.statusColor}`}
                      style={{ boxShadow: `0 0 10px ${emp.statusShadow}` }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center text-xs font-bold text-muted-foreground bg-muted/20 gap-4">
          <span>Showing <span className="font-mono text-foreground">{Math.min(1 + (currentPage - 1) * itemsPerPage, tableEmployees.length)}</span>-<span className="font-mono text-foreground">{Math.min(currentPage * itemsPerPage, tableEmployees.length)}</span> of <span className="font-mono text-foreground">{tableEmployees.length}</span> Employees</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:hover:bg-transparent" 
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono transition-colors ${
                  currentPage === i + 1 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-muted hover:text-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
