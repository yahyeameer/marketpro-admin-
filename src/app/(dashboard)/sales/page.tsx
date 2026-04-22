"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Plus,
  Receipt,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  User,
  Tags,
  FilterX,
  ChevronDown,
  X,
  DollarSign,
} from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { logActivity } from "@/lib/utils/log-activity";

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

function AddSaleModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customer: "", service: "", price: "" });

  const handleSubmit = async () => {
    if (!form.customer || !form.price || !user) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("sales").insert({
      user_id: user.id,
      customer: form.customer,
      service: form.service,
      price: parseFloat(form.price),
      sale_date: new Date().toISOString(),
    });
    if (!error) {
      await logActivity(user.id, "created_sale", "sale", undefined, { customer: form.customer, price: form.price });
      onSave();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1d]/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(189,157,255,0.08)] relative bg-[#18182b] border border-[#474659]/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6daf]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff6daf]/10"><DollarSign className="w-5 h-5 text-[#ff6daf]" /></div>
            <h3 className="font-heading text-lg font-bold text-[#e6e3fb]">Record New Sale</h3>
          </div>
          <button onClick={onClose} className="text-[#aba9bf] hover:text-[#e6e3fb] p-1 rounded-full hover:bg-white/5"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#aba9bf]">Customer Name *</label>
            <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} type="text" placeholder="Acme Corp" className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#aba9bf]">Service</label>
            <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} type="text" placeholder="Enterprise Setup" className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#aba9bf]">Price *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-[#aba9bf] w-4 h-4" />
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" step="0.01" placeholder="0.00" className="w-full bg-[#111124] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-[#000000]/30 relative z-10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#e6e3fb] hover:bg-white/5 transition-colors border border-white/5">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !form.customer || !form.price} className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0c0c1d] hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all disabled:opacity-50">
            {saving ? "Saving..." : "Record Sale"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SalesPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchSales = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("sales")
      .select("id, customer, service, price, sale_date, users(name)")
      .order("sale_date", { ascending: false });

    if (data) {
      let totalRev = 0;
      const colors = [
        { badge: "bg-[#53ddfc]/10 text-[#53ddfc] border-[#53ddfc]/20", bg: "bg-[#bd9dff]/20 text-[#8a4cfc]" },
        { badge: "bg-[#53ddfc]/10 text-[#53ddfc] border-[#53ddfc]/20", bg: "bg-[#ff6daf]/20 text-[#ff67ad]" },
        { badge: "bg-[#bd9dff]/10 text-[#8a4cfc] border-[#bd9dff]/20", bg: "bg-[#bd9dff]/20 text-[#8a4cfc]" },
        { badge: "bg-[#ff6e84]/10 text-[#d73357] border-[#ff6e84]/20", bg: "bg-[#ff6daf]/20 text-[#ff67ad]" },
      ];

      const mapped = data.map((sale: any, index: number) => {
        totalRev += Number(sale.price);
        const c = colors[index % colors.length];
        const initials = sale.customer.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
        const p = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(sale.price);
        const d = new Date(sale.sale_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        return {
          id: `#TRX-${sale.id.substring(0, 4).toUpperCase()}`,
          rawId: sale.id,
          customerInitials: initials,
          customerName: sale.customer,
          avatarBg: c.bg,
          service: sale.service,
          price: p,
          rawPrice: sale.price,
          date: d,
          rawDate: sale.sale_date,
          salesperson: sale.users?.name || "Unknown Agent",
          status: "Completed",
          statusBadge: c.badge,
        };
      });

      setSalesData(mapped);
      setTotalRevenue(totalRev);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const totalSales = salesData.length;
  const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  const statsData = [
    {
      title: "Total Sales Count",
      value: totalSales.toString(),
      trend: "+8%",
      trendUp: true,
      icon: Receipt,
      glowClass: "bg-[#bd9dff]/10",
      iconClass: "text-[#8a4cfc]",
    },
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumSignificantDigits: 4 }).format(totalRevenue),
      trend: "+14%",
      trendUp: true,
      fontMono: true,
      icon: Wallet,
      glowClass: "bg-[#fa53a4]/10",
      iconClass: "text-[#ff67ad]",
    },
    {
      title: "Average Sale Value",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(avgSale),
      trend: "+6%",
      trendUp: true,
      fontMono: true,
      icon: Activity,
      glowClass: "bg-[#40ceed]/10",
      iconClass: "text-[#40ceed]",
    },
  ];

  const handleExport = () => {
    exportCSV(
      salesData.map((s) => ({
        ID: s.id,
        Customer: s.customerName,
        Service: s.service,
        Price: s.rawPrice,
        Date: s.date,
        Salesperson: s.salesperson,
        Status: s.status,
      })),
      "sales-export.csv"
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10">
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[60px] z-0 pointer-events-none -top-[200px] -right-[100px]" style={{ background: "radial-gradient(circle, rgba(189,157,255,0.15) 0%, rgba(12,12,29,0) 70%)" }} />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[60px] z-0 pointer-events-none top-[40%] -left-[150px]" style={{ background: "radial-gradient(circle, rgba(64,206,237,0.1) 0%, rgba(12,12,29,0) 70%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight mb-2">Sales Management</h2>
            <p className="text-[#aba9bf] text-sm">Review and analyze recent transactions across all territories.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#474659]/30 text-[#8a4cfc] text-sm font-medium hover:bg-white/10 transition-colors backdrop-blur-md">
              <Download className="w-4 h-4" />Export to CSV
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#bd9dff] to-[#53ddfc] text-[#000000] font-semibold text-sm hover:shadow-[0_0_20px_rgba(189,157,255,0.3)] transition-all">
              <Plus className="w-4 h-4" />New Record
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="relative overflow-hidden rounded-xl bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl ${stat.glowClass}`} />
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <p className="text-[#aba9bf] text-sm font-medium">{stat.title}</p>
                  <Icon className={`w-5 h-5 ${stat.iconClass}`} />
                </div>
                <div className="relative z-10">
                  <h3 className={`text-4xl font-bold text-white tracking-tight ${stat.fontMono ? "font-mono" : "font-heading"}`}>{stat.value}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`flex items-center text-xs font-medium ${stat.trendUp ? "text-[#53ddfc]" : "text-[#ff6e84]"}`}>
                      {stat.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                      {stat.trend}
                    </span>
                    <span className="text-xs text-[#aba9bf]">vs last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-xl bg-[#1d1d33] border border-[#e6e3fb]/10 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111124]/50 border-b border-[#23233b]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading hidden md:table-cell">Service</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading text-right">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading hidden lg:table-cell">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading hidden lg:table-cell">Salesperson</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23233b]/50">
                {loading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-[#aba9bf]"><div className="w-6 h-6 border-2 border-[#bd9dff]/30 border-t-[#bd9dff] rounded-full animate-spin mx-auto mb-3" />Loading sales...</td></tr>
                ) : salesData.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-[#aba9bf]">No sales recorded yet. Click "New Record" to add one.</td></tr>
                ) : (
                  salesData.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${row.avatarBg}`}>{row.customerInitials}</div>
                          <div>
                            <div className="font-medium text-white text-sm group-hover:text-[#bd9dff] transition-colors">{row.customerName}</div>
                            <div className="text-xs text-[#aba9bf]">ID: {row.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#e6e3fb] hidden md:table-cell">{row.service}</td>
                      <td className="px-6 py-4 text-sm font-mono font-medium text-white text-right">{row.price}</td>
                      <td className="px-6 py-4 text-sm text-[#aba9bf] hidden lg:table-cell">{row.date}</td>
                      <td className="px-6 py-4 text-sm text-[#e6e3fb] hidden lg:table-cell">{row.salesperson}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${row.statusBadge}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {salesData.length > 0 && (
                <tfoot>
                  <tr className="bg-[#23233b] border-t border-[#23233b]/80">
                    <td className="px-6 py-4 text-right font-heading font-semibold text-white" colSpan={2}>Period Total:</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#8a4cfc] text-lg">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalRevenue)}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <div className="px-6 py-4 border-t border-[#23233b] bg-[#111124] flex items-center justify-between">
            <span className="text-sm text-[#aba9bf]">Showing {salesData.length} entries</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <AddSaleModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); fetchSales(); }} />}
      </AnimatePresence>
    </motion.div>
  );
}
