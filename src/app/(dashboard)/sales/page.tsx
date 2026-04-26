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
import { useProducts } from "@/lib/hooks/use-products";

interface MappedSale {
  id: string;
  rawId: string;
  customerInitials: string;
  customerName: string;
  avatarBg: string;
  service: string;
  price: string;
  rawPrice: number;
  date: string;
  rawDate: string;
  salesperson: string;
  status: string;
  statusBadge: string;
}

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

function AddSaleModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const { activeProducts, getDiscountedPrice } = useProducts();
  
  const [form, setForm] = useState({ 
    customer: "", 
    service: activeProducts.length > 0 ? activeProducts[0].name : "Internet", 
    price: activeProducts.length > 0 ? getDiscountedPrice(activeProducts[0].id).toString() : "",
    sale_date: new Date().toISOString().split('T')[0]
  });

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedProduct = activeProducts.find(p => p.name === selectedName);
    setForm({
      ...form,
      service: selectedName,
      price: selectedProduct ? getDiscountedPrice(selectedProduct.id).toString() : form.price
    });
  };

  const handleSubmit = async () => {
    if (!form.customer || !form.price || !user) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("sales").insert({
      user_id: user.id,
      customer: form.customer,
      service: form.service,
      price: parseFloat(form.price),
      sale_date: new Date(form.sale_date).toISOString(),
    });
    if (!error) {
      await logActivity(user.id, "created_sale", "sale", undefined, { customer: form.customer, price: form.price });
      onSave();
    } else {
      console.error("Error saving sale:", error);
      alert("Failed to record sale. Please try again.");
    }
    setSaving(false);
  };

  const inputClasses = "w-full glass-panel rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] focus:outline-none transition-all placeholder:text-muted-foreground";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl relative bg-background border border-border"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="p-8 border-b border-border/50 flex justify-between items-center relative z-10 bg-muted/30 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center border border-primary/20 shadow-inner">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground tracking-tight">Record New Sale</h3>
              <p className="text-xs text-muted-foreground">Enter transaction details.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-foreground/5 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Customer Name *</label>
            <input 
              value={form.customer} 
              onChange={(e) => setForm({ ...form, customer: e.target.value })} 
              type="text" 
              placeholder="Client Name" 
              className={inputClasses} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Service Provided</label>
              <select 
                value={form.service} 
                onChange={handleServiceChange} 
                className={`${inputClasses} cursor-pointer bg-background`}
              >
                {activeProducts.map(p => (
                  <option key={p.id} value={p.name} className="bg-background text-foreground">{p.name}</option>
                ))}
                {activeProducts.length === 0 && <option value="Internet" className="bg-background text-foreground">Internet</option>}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Price *</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  className={`${inputClasses} pl-12`} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Sale Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  value={form.sale_date} 
                  onChange={(e) => setForm({ ...form, sale_date: e.target.value })} 
                  type="date" 
                  className={`${inputClasses} pl-12`} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Salesperson</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  value={user?.name || ""} 
                  disabled 
                  type="text" 
                  className={`${inputClasses} pl-12 opacity-50 cursor-not-allowed`} 
                />
              </div>
            </div>
          </div>

          {/* Auto-calculated Total Display */}
          <div className="p-6 rounded-2xl glass-panel shadow-sm border-primary/20 flex items-center justify-between bg-primary/5">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Amount</span>
            <span className="text-2xl font-mono font-bold text-foreground">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(parseFloat(form.price) || 0)}
            </span>
          </div>
        </div>

        <div className="p-8 border-t border-border/50 bg-muted/50 backdrop-blur-sm relative z-10">
          <button 
            onClick={handleSubmit} 
            disabled={saving || !form.customer || !form.price} 
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-base font-bold shadow-sm hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {saving ? "Processing..." : "Submit Sale"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SalesPage() {
  const [salesData, setSalesData] = useState<MappedSale[]>([]);
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
        { badge: "bg-primary/10 text-primary border-primary/20", bg: "bg-primary/20 text-primary" },
        { badge: "bg-accent/10 text-accent border-accent/20", bg: "bg-accent/20 text-accent" },
        { badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", bg: "bg-emerald-500/20 text-emerald-500" },
        { badge: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", bg: "bg-indigo-500/20 text-indigo-500" },
      ];

      const mapped: MappedSale[] = data.map((sale: any, index: number) => {
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
      glowClass: "bg-primary/10",
      iconClass: "text-primary",
    },
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumSignificantDigits: 4 }).format(totalRevenue),
      trend: "+14%",
      trendUp: true,
      fontMono: true,
      icon: Wallet,
      glowClass: "bg-accent/10",
      iconClass: "text-accent",
    },
    {
      title: "Average Sale Value",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(avgSale),
      trend: "+6%",
      trendUp: true,
      fontMono: true,
      icon: Activity,
      glowClass: "bg-emerald-500/10",
      iconClass: "text-emerald-500",
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
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[60px] will-change-transform transform-gpu z-0 pointer-events-none -top-[200px] -right-[100px]" style={{ background: "radial-gradient(circle, rgba(255, 255, 255,0.15) 0%, rgba(255,255,255,0) 70%)" }} />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[60px] will-change-transform transform-gpu z-0 pointer-events-none top-[40%] -left-[150px]" style={{ background: "radial-gradient(circle, rgba(228,228,231,0.2) 0%, rgba(255,255,255,0) 70%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold font-heading text-foreground tracking-tight mb-2">Sales Management</h2>
            <p className="text-muted-foreground text-sm">Review and analyze recent transactions across all territories.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-muted-foreground text-sm font-medium hover:bg-foreground/5 transition-colors backdrop-blur-md">
              <Download className="w-4 h-4" />Export to CSV
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all">
              <Plus className="w-4 h-4" />New Record
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="relative overflow-hidden rounded-xl glass-panel p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl ${stat.glowClass}`} />
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                  <Icon className={`w-5 h-5 ${stat.iconClass}`} />
                </div>
                <div className="relative z-10">
                  <h3 className={`text-4xl font-bold text-foreground tracking-tight ${stat.fontMono ? "font-mono" : "font-heading"}`}>{stat.value}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`flex items-center text-xs font-bold ${stat.trendUp ? "text-emerald-500" : "text-destructive"}`}>
                      {stat.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                      {stat.trend}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">vs last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-xl glass-panel overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 border-b border-border/50">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading hidden md:table-cell">Service</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading text-right">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading hidden lg:table-cell">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading hidden lg:table-cell">Salesperson</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground"><div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-3" />Loading sales...</td></tr>
                ) : salesData.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">No sales recorded yet. Click "New Record" to add one.</td></tr>
                ) : (
                  salesData.map((row, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${row.avatarBg} shadow-sm`}>{row.customerInitials}</div>
                          <div>
                            <div className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{row.customerName}</div>
                            <div className="text-xs text-muted-foreground font-mono">ID: {row.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium hidden md:table-cell">{row.service}</td>
                      <td className="px-6 py-4 text-sm font-mono font-bold text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] text-right">{row.price}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-medium hidden lg:table-cell">{row.date}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium hidden lg:table-cell">{row.salesperson}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm ${row.statusBadge}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {salesData.length > 0 && (
                <tfoot>
                  <tr className="bg-muted/50 border-t border-border/80">
                    <td className="px-6 py-4 text-right font-heading font-bold text-foreground" colSpan={2}>Period Total:</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-primary text-lg drop-shadow-sm">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalRevenue)}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <div className="px-6 py-4 border-t border-border/50 bg-muted/30 flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Showing {salesData.length} entries</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <AddSaleModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); fetchSales(); }} />}
      </AnimatePresence>
    </motion.div>
  );
}
