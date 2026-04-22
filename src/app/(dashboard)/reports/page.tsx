"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, ChevronDown, BarChart2, FileText, Download, TrendingUp, TrendingDown 
} from "lucide-react";

function exportCSV(data: Record<string, unknown>[], filename: string) {
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

export default function ReportsPage() {
  const [data, setData] = useState<any>({ rev: 0, count: 0, topAgents: [] });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      const { data: sales } = await supabase.from("sales").select("price, sale_date, users(id, name)");
      
      if (sales) {
        let max = 0;
        let rev = 0;
        const revMap = new Map();
        const agentMap = new Map();
        
        sales.forEach((s: any) => {
          const price = Number(s.price);
          rev += price;
          
          if (s.users) {
            agentMap.set(s.users.id, { 
              name: s.users.name, 
              rev: (agentMap.get(s.users.id)?.rev || 0) + price 
            });
          }
          
          // Chart points
          const w = Math.min(new Date(s.sale_date).getDate() % 5, 4); // Dummy bucket week 1-5
          revMap.set(w, (revMap.get(w) || 0) + price);
        });

        const arr = Array.from(revMap.entries()).sort((a,b)=>a[0]-b[0]);
        max = Math.max(...arr.map(x=>x[1]), 100);
        
        const top = Array.from(agentMap.values()).sort((a,b)=>b.rev - a.rev).slice(0, 5);

        setChartData(arr.length ? arr.map(e => ({ pos: e[0], val: e[1], max })) : [{pos:0, val:1, max:1}]);
        setData({ rev, count: sales.length, topAgents: top });
      }
    }
    fetchData();
  }, []);

  const handleExport = () => {
    exportCSV([{ "Metric": "Total Revenue", "Value": data.rev }, { "Metric": "Total Sales", "Value": data.count }], "summary-report.csv");
  };

  const polyPoints = chartData.map((d, i) => {
    const x = i === 0 ? 0 : (i / (chartData.length - 1)) * 100;
    const y = 100 - ((d.val / d.max) * 90);
    return `${x},${y}`;
  });
  
  const pathData = polyPoints.length > 0 ? `M${polyPoints[0]} L${polyPoints.slice(1).join(" L")}` : "M0,90 L100,90";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 lg:p-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-[#e6e3fb] tracking-tight mb-2">Performance Reports</h2>
          <p className="font-body text-sm text-[#aba9bf]">Generate and analyze comprehensive data across all metrics.</p>
        </div>

        <div className="flex gap-3 bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 p-2 rounded-xl">
          <button className="bg-[#111124] border border-[#474659]/30 rounded-lg px-3 py-2 flex items-center text-sm text-[#e6e3fb]">
            <Calendar className="w-4 h-4 mr-2" /> Last 30 Days <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          <button onClick={handleExport} className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-4 py-2 rounded-lg text-sm text-black flex items-center gap-2 font-medium">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart */}
        <div className="lg:col-span-12 bg-white/[0.06] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#e6e3fb]">Revenue Trend</h3>
              <p className="text-xs text-[#aba9bf] mt-1">Aggregate over period</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-[#e6e3fb] font-mono">
                ${(data.rev / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
          <div className="h-64 w-full relative pt-4">
             <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-[#474659]/20 pb-6 pl-2">
                {[3,2,1,0].map(i => <div key={i} className="w-full border-t border-[#474659]/10 h-0"><span className="absolute -left-8 -top-2 text-[10px] text-[#aba9bf]">{i?i+'k':'0'}</span></div>)}
             </div>
             <div className="absolute bottom-0 left-2 right-0 flex justify-between text-[10px] text-[#aba9bf] pt-2">
                {['W1','W2','W3','W4','W5'].map(w => <span key={w}>{w}</span>)}
             </div>
             <div className="relative w-full h-[calc(100%-24px)] ml-2 flex items-end">
                <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d={`${pathData} L100,100 L0,100 Z`} fill="url(#grad)" opacity="0.2" />
                  <path d={pathData} fill="none" stroke="#bd9dff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bd9dff"/><stop offset="100%" stopColor="#000" stopOpacity="0"/></linearGradient>
                  </defs>
                </svg>
             </div>
          </div>
        </div>

        {/* Heatmap summary */}
        <div className="lg:col-span-8 bg-white/[0.06] border border-[#474659]/30 rounded-xl p-6">
           <h3 className="font-heading text-lg font-bold text-[#e6e3fb] mb-6">Activity Heatmap</h3>
           <div className="flex-1 grid grid-cols-8 gap-1 h-[200px]">
             <div className="col-span-1 flex flex-col justify-around text-[10px] text-[#aba9bf] text-right pr-2">
               {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><span key={d}>{d}</span>)}
             </div>
             <div className="col-span-7 grid grid-cols-12 grid-rows-7 gap-1">
               {Array.from({length: 84}).map((_, i) => (
                 <div key={i} className={`rounded-sm ${i%3===0 ? 'bg-[#53ddfc]/80' : i%5===0 ? 'bg-[#bd9dff]/80' : 'bg-[#111124]'}`} />
               ))}
             </div>
           </div>
        </div>

        {/* Top Performers */}
        <div className="lg:col-span-4 bg-white/[0.06] border border-[#474659]/30 rounded-xl p-6">
           <h3 className="font-heading text-lg font-bold text-[#e6e3fb] mb-4">Top Performers</h3>
           <div className="space-y-4">
             {data.topAgents.length === 0 ? <p className="text-sm text-[#aba9bf]">No data yet.</p> :
              data.topAgents.map((emp: any, i: number) => {
               const max = data.topAgents[0].rev;
               const p = Math.max((emp.rev / max) * 100, 5);
               return (
                 <div key={i}>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-[#e6e3fb]">{emp.name}</span>
                     <span className="font-bold text-[#bd9dff]">${emp.rev}</span>
                   </div>
                   <div className="w-full h-1.5 bg-[#23233b] rounded-full">
                     <div className="h-full bg-[#bd9dff] rounded-full" style={{width: `${p}%`}} />
                   </div>
                 </div>
               )
             })}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
