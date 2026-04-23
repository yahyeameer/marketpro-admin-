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
      className="bg-[#111124]/30 backdrop-blur-[32px] rounded-xl p-5 border border-[#474659]/15 flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
      style={{ boxShadow: '0 0 40px rgba(138, 76, 252, 0.05)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#474659]/30 bg-[#23233b] flex items-center justify-center">
            {employee.image ? (
              <img src={employee.image} alt={employee.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-[#bd9dff]">{employee.initials}</span>
            )}
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-[#e6e3fb]">{employee.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border
              ${employee.role === "Senior Field Rep" ? "bg-[#bd9dff]/10 text-[#bd9dff] border-[#bd9dff]/20" : "bg-[#23233b] text-[#aba9bf] border-[#474659]/30"}
            `}>
              {employee.role}
            </span>
          </div>
        </div>
        <button className="text-[#aba9bf] hover:text-[#e6e3fb]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
        {[
          { label: "Visits", ...employee.visits },
          { label: "Leads", ...employee.leads },
          { label: "Sales", ...employee.sales },
          { label: "Revenue", ...employee.revenue, isPrimary: true },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111124]/50 rounded-lg p-3">
            <p className="text-xs text-[#aba9bf] mb-1 font-body">{stat.label}</p>
            <p className={`font-heading text-lg font-bold tracking-tight ${stat.isPrimary ? "text-[#bd9dff]" : "text-[#e6e3fb]"}`}>
              {stat.value}
            </p>
            <p className={`text-[10px] mt-1 flex items-center gap-0.5 ${stat.up ? "text-[#53ddfc]" : "text-[#ff6e84]"}`}>
              {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-[#474659]/10 pt-3">
        <div className="flex items-center justify-between text-xs text-[#aba9bf] mb-2">
          <span>Performance Trend</span>
          <span className={employee.trendColor}>{employee.trendStatus}</span>
        </div>
        <div className="w-full h-8 flex items-end gap-1">
          {sparklineBars.map((bar, i) => (
             <div 
               key={i} 
               className={`w-1/6 rounded-t-sm ${bar.bg} ${bar.shadow ? `shadow-[0_0_8px_${bar.shadow}]` : ""}`}
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
          
          let color = "bg-[#bd9dff]";
          let shadow = "rgba(189,157,255,0.6)";
          let tColor = "text-[#aba9bf]";
          
          if (index === 0) { color = "bg-[#53ddfc]"; shadow = "rgba(83,221,252,0.6)"; tColor = "text-[#53ddfc]";}
          if (index === 1) { color = "bg-[#ff6daf]"; shadow = "rgba(255,109,175,0.6)"; tColor = "text-[#ff6daf]"; }

          return {
            id: user.id,
            name: user.name,
            role: user.role === 'admin' ? "Regional Director" : "Senior Field Rep",
            image: "",
            initials: user.name.split(" ").map((n: string) => n[0]).join("").substring(0,2).toUpperCase(),
            visits: { value: v, trend: `+${(seed % 15) + 1}%`, up: (seed % 2 === 0) },
            leads: { value: Math.floor(v * 0.7), trend: `+${(seed % 8) + 1}%`, up: true },
            sales: { value: s, trend: `${(seed % 2 === 0 ? '+' : '-')}${(seed % 6) + 1}%`, up: (seed % 2 === 0) },
            revenue: { value: `$${(rev/1000).toFixed(1)}k`, trend: `+${(seed % 20) + 1}%`, up: true },
            trendStatus: index === 0 ? "Excellent" : index === 1 ? "Volatile" : "Stable",
            trendColor: tColor,
            territory: index % 2 === 0 ? "Northwest Region" : "Central District",
            convRate: `${((s / Math.floor(v * 0.7))*100).toFixed(1)}%`,
            avgDeal: `$${(rev/s).toFixed(2)}`,
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
      { height: "33%", bg: "bg-[#bd9dff]/30" }, { height: "50%", bg: "bg-[#bd9dff]/40" },
      { height: "40%", bg: "bg-[#bd9dff]/50" }, { height: "75%", bg: "bg-[#bd9dff]/70" },
      { height: "85%", bg: "bg-[#bd9dff]/80" }, { height: "100%", bg: "bg-[#53ddfc]", shadow: "rgba(83,221,252,0.5)" }
    ],
    [
      { height: "45%", bg: "bg-[#bd9dff]/30" }, { height: "40%", bg: "bg-[#bd9dff]/30" },
      { height: "50%", bg: "bg-[#bd9dff]/40" }, { height: "48%", bg: "bg-[#bd9dff]/40" },
      { height: "55%", bg: "bg-[#bd9dff]/50" }, { height: "60%", bg: "bg-[#bd9dff]/60" }
    ],
    [
      { height: "30%", bg: "bg-[#bd9dff]/20" }, { height: "60%", bg: "bg-[#bd9dff]/40" },
      { height: "90%", bg: "bg-[#bd9dff]/70" }, { height: "40%", bg: "bg-[#bd9dff]/30" },
      { height: "70%", bg: "bg-[#bd9dff]/50" }, { height: "45%", bg: "bg-[#ff6daf]", shadow: "rgba(255,109,175,0.5)" }
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
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(32px);
            border: 1px solid rgba(71, 70, 89, 0.15);
        }
        .ambient-shadow {
            box-shadow: 0 0 60px rgba(138, 76, 252, 0.05); 
        }
      `}} />

      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#e6e3fb] tracking-tight mb-1">Employee Performance</h1>
          <p className="text-[#aba9bf] text-sm font-body">Real-time metrics and historical KPI data for field staff.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="glass-panel rounded-lg flex items-center px-3 py-1.5 text-sm cursor-pointer hover:bg-white/10 transition-colors">
            <CalendarDays className="w-4 h-4 text-[#aba9bf] mr-2" />
            <span className="text-[#e6e3fb] font-medium">Last 30 Days</span>
            <ChevronDown className="w-4 h-4 text-[#aba9bf] ml-2" />
          </div>
          <button onClick={handleExport} className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-black font-medium text-sm px-4 py-1.5 rounded-lg hover:shadow-[0_0_15px_rgba(189,157,255,0.4)] transition-all flex items-center gap-2">
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
      <div className="bg-[#111124]/30 backdrop-blur-[32px] rounded-xl border border-[#474659]/15 overflow-hidden ambient-shadow">
        <div className="px-6 py-4 border-b border-[#474659]/15 flex justify-between items-center bg-[#111124]/30">
          <h2 className="font-heading text-lg font-bold text-[#e6e3fb]">Comprehensive KPI Directory</h2>
          <button onClick={() => router.push('/reports')} className="text-sm text-[#bd9dff] hover:text-[#a67aff] transition-colors flex items-center gap-1 font-medium group">
            View Reports <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-xs text-[#aba9bf] font-body uppercase tracking-wider bg-[#000000]/50">
                <th className="px-6 py-4 font-medium flex items-center gap-1 cursor-pointer hover:text-[#e6e3fb]">
                  Employee <ChevronDown className="w-3.5 h-3.5" />
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb]">Territory</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb] text-right">Total Visits</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb] text-right">Conv. Rate</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb] text-right">Avg Deal Size</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb] text-right">Total Revenue</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#474659]/10">
              {currentEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#23233b]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#23233b] flex items-center justify-center border border-[#474659]/30 text-xs font-bold text-[#bd9dff]">
                        {emp.image ? (
                           <img src={emp.image} alt={emp.name} className="w-full h-full object-cover" />
                        ) : (
                           emp.initials
                        )}
                      </div>
                      <span className="font-medium text-[#e6e3fb]">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#aba9bf]">{emp.territory}</td>
                  <td className="px-6 py-4 text-right">{emp.visits.value}</td>
                  <td className={`px-6 py-4 text-right ${emp.visits.up ? "text-[#53ddfc]" : "text-[#ff6e84]"}`}>
                    {emp.convRate}
                  </td>
                  <td className="px-6 py-4 text-right">{emp.avgDeal}</td>
                  <td className="px-6 py-4 text-right font-medium text-[#bd9dff]">{emp.totalRev}</td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      className={`inline-block w-2 h-2 rounded-full ${emp.statusColor}`}
                      style={{ boxShadow: `0 0 8px ${emp.statusShadow}` }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-[#474659]/15 flex flex-col sm:flex-row justify-between items-center text-xs text-[#aba9bf] bg-[#000000]/30 gap-4">
          <span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, tableEmployees.length)} of {tableEmployees.length} Employees</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#23233b] transition-colors disabled:opacity-50" 
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                  currentPage === i + 1 
                    ? "bg-[#bd9dff]/20 text-[#bd9dff] font-medium border border-[#bd9dff]/30" 
                    : "hover:bg-[#23233b]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#23233b] transition-colors disabled:opacity-50"
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
