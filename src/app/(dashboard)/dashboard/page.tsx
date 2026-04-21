"use client";

import { MapPin, ShoppingCart, CreditCard, Users, Download, CalendarDays, ChevronDown } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { LeadFunnel } from "@/components/dashboard/lead-funnel";
import { TopPerformers } from "@/components/dashboard/top-performers";

export default function DashboardPage() {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#e6e3fb] tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-[#aba9bf] mt-1">
            Live metrics and performance data for today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-[#474659]/15 bg-white/[0.03] backdrop-blur-[32px] px-4 py-2 text-sm font-medium text-[#aba9bf] hover:text-[#e6e3fb] transition-colors flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Today
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-black px-5 py-2 rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(189,157,255,0.3)] hover:shadow-[0_0_30px_rgba(189,157,255,0.5)] transition-shadow flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Field Visits"
          value="2,405"
          icon={MapPin}
          trend="+12.5%"
          trendDirection="up"
          glowColor="rgba(189, 157, 255, 0.1)"
          orbColor="#bd9dff"
          iconColor="#bd9dff"
        />
        <KpiCard
          title="Total Sales"
          value="842"
          icon={ShoppingCart}
          trend="+8.2%"
          trendDirection="up"
          glowColor="rgba(255, 109, 175, 0.1)"
          orbColor="#ff6daf"
          iconColor="#ff6daf"
        />
        <KpiCard
          title="Total Revenue"
          value="$124.5k"
          icon={CreditCard}
          trend="+24.1%"
          trendDirection="up"
          glowColor="rgba(83, 221, 252, 0.1)"
          orbColor="#53ddfc"
          iconColor="#53ddfc"
        />
        <KpiCard
          title="Active Staff"
          value="156"
          valueSuffix="/160"
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
