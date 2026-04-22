"use client";

import { useEffect, useState } from "react";
import { MapPin, ShoppingCart, CreditCard, Users, Download, CalendarDays, ChevronDown } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { LeadFunnel } from "@/components/dashboard/lead-funnel";
import { TopPerformers } from "@/components/dashboard/top-performers";
import { createClient } from "@/lib/supabase/client";

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

export default function DashboardPage() {
  const [kpis, setKpis] = useState({
    visits: 0,
    sales: 0,
    revenue: 0,
    staff: 0,
  });
  const [exportData, setExportData] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    async function fetchKPIs() {
      const supabase = createClient();

      const [visitsRes, salesRes, usersRes] = await Promise.all([
        supabase.from("field_visits").select("id", { count: "exact", head: true }),
        supabase.from("sales").select("id, price"),
        supabase.from("users").select("id", { count: "exact", head: true }),
      ]);

      const totalVisits = visitsRes.count || 0;
      const totalSales = salesRes.data?.length || 0;
      const totalRevenue = salesRes.data?.reduce((sum, s) => sum + Number(s.price || 0), 0) || 0;
      const totalStaff = usersRes.count || 0;

      setKpis({ visits: totalVisits, sales: totalSales, revenue: totalRevenue, staff: totalStaff });

      // Build export dataset
      if (salesRes.data) {
        const { data: fullSales } = await supabase
          .from("sales")
          .select("customer, service, price, sale_date, users(name)")
          .order("sale_date", { ascending: false });
        if (fullSales) {
          setExportData(
            fullSales.map((s: any) => ({
              Customer: s.customer,
              Service: s.service,
              Price: s.price,
              Date: new Date(s.sale_date).toLocaleDateString(),
              Agent: s.users?.name || "Unknown",
            }))
          );
        }
      }
    }
    fetchKPIs();
  }, []);

  const formatCurrency = (v: number) =>
    v >= 1000
      ? `$${(v / 1000).toFixed(1)}k`
      : `$${v.toFixed(0)}`;

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#e6e3fb] tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-[#aba9bf] mt-1">
            Live metrics and performance data.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-[#474659]/15 bg-white/[0.03] backdrop-blur-[32px] px-4 py-2 text-sm font-medium text-[#aba9bf] hover:text-[#e6e3fb] transition-colors flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Today
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => exportCSV(exportData, "marketpro-report.csv")}
            className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-black px-5 py-2 rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(189,157,255,0.3)] hover:shadow-[0_0_30px_rgba(189,157,255,0.5)] transition-shadow flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Field Visits"
          value={kpis.visits.toLocaleString()}
          icon={MapPin}
          trend="+12.5%"
          trendDirection="up"
          glowColor="rgba(189, 157, 255, 0.1)"
          orbColor="#bd9dff"
          iconColor="#bd9dff"
        />
        <KpiCard
          title="Total Sales"
          value={kpis.sales.toLocaleString()}
          icon={ShoppingCart}
          trend="+8.2%"
          trendDirection="up"
          glowColor="rgba(255, 109, 175, 0.1)"
          orbColor="#ff6daf"
          iconColor="#ff6daf"
        />
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(kpis.revenue)}
          icon={CreditCard}
          trend="+24.1%"
          trendDirection="up"
          glowColor="rgba(83, 221, 252, 0.1)"
          orbColor="#53ddfc"
          iconColor="#53ddfc"
        />
        <KpiCard
          title="Active Staff"
          value={kpis.staff.toString()}
          icon={Users}
          trend="0.0%"
          trendDirection="neutral"
          glowColor="rgba(72, 212, 243, 0.1)"
          orbColor="#48d4f3"
          iconColor="#48d4f3"
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Bottom Row: Lead Funnel + Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LeadFunnel />
        </div>
        <div className="lg:col-span-2">
          <TopPerformers />
        </div>
      </div>
    </>
  );
}
