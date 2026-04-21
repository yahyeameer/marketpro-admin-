"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";

const statsData = [
  {
    title: "Total Sales Count",
    value: "1,248",
    trend: "+12.5%",
    trendUp: true,
    icon: Receipt,
    glowClass: "bg-[#bd9dff]/10",
    iconClass: "text-[#8a4cfc]",
  },
  {
    title: "Total Revenue",
    value: "$482.5K",
    trend: "+8.2%",
    trendUp: true,
    fontMono: true,
    icon: Wallet,
    glowClass: "bg-[#fa53a4]/10",
    iconClass: "text-[#ff67ad]",
  },
  {
    title: "Average Sale Value",
    value: "$386.42",
    trend: "-2.1%",
    trendUp: false,
    fontMono: true,
    icon: Activity,
    glowClass: "bg-[#40ceed]/10",
    iconClass: "text-[#40ceed]",
  },
];

const salesData = [
  {
    id: "#TRX-8921",
    customerInitials: "AC",
    customerName: "Acme Corp",
    avatarBg: "bg-[#bd9dff]/20 text-[#8a4cfc]",
    service: "Enterprise Setup",
    price: "$12,500.00",
    date: "Oct 24, 2023",
    salesperson: "Sarah Jenkins",
    status: "Completed",
    statusBadge: "bg-[#53ddfc]/10 text-[#53ddfc] border-[#53ddfc]/20",
  },
  {
    id: "#TRX-8920",
    customerInitials: "GL",
    customerName: "Global Logistics",
    avatarBg: "bg-[#ff6daf]/20 text-[#ff67ad]",
    service: "Monthly Retainer",
    price: "$3,200.00",
    date: "Oct 23, 2023",
    salesperson: "Marcus Chen",
    status: "Completed",
    statusBadge: "bg-[#53ddfc]/10 text-[#53ddfc] border-[#53ddfc]/20",
  },
  {
    id: "#TRX-8919",
    customerInitials: "NT",
    customerName: "Nexus Tech",
    avatarBg: "bg-[#bd9dff]/20 text-[#8a4cfc]",
    service: "Audit & Consulting",
    price: "$8,450.00",
    date: "Oct 22, 2023",
    salesperson: "Elena Rodriguez",
    status: "Processing",
    statusBadge: "bg-[#bd9dff]/10 text-[#8a4cfc] border-[#bd9dff]/20",
  },
  {
    id: "#TRX-8918",
    customerInitials: "SK",
    customerName: "Skyline Retail",
    avatarBg: "bg-[#ff6daf]/20 text-[#ff67ad]",
    service: "Enterprise Setup",
    price: "$15,000.00",
    date: "Oct 21, 2023",
    salesperson: "Sarah Jenkins",
    status: "Pending",
    statusBadge: "bg-[#ff6e84]/10 text-[#d73357] border-[#ff6e84]/20",
  },
  {
    id: "#TRX-8917",
    customerInitials: "VM",
    customerName: "Vanguard Media",
    avatarBg: "bg-[#bd9dff]/20 text-[#8a4cfc]",
    service: "Monthly Retainer",
    price: "$4,500.00",
    date: "Oct 20, 2023",
    salesperson: "Marcus Chen",
    status: "Completed",
    statusBadge: "bg-[#53ddfc]/10 text-[#53ddfc] border-[#53ddfc]/20",
  },
];

export default function SalesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 lg:p-8 xl:p-10 relative z-10"
    >
      {/* Liquid Light Orbs (Sales Page specific) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[60px] z-0 pointer-events-none -top-[200px] -right-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(189,157,255,0.15) 0%, rgba(12,12,29,0) 70%)",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[60px] z-0 pointer-events-none top-[40%] -left-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(64,206,237,0.1) 0%, rgba(12,12,29,0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Page Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight mb-2">
              Sales Management
            </h2>
            <p className="text-[#aba9bf] text-sm">
              Review and analyze recent transactions across all territories.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#474659]/30 text-[#8a4cfc] text-sm font-medium hover:bg-white/10 transition-colors backdrop-blur-md">
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#bd9dff] to-[#53ddfc] text-[#000000] font-semibold text-sm hover:shadow-[0_0_20px_rgba(189,157,255,0.3)] transition-all">
              <Plus className="w-4 h-4" />
              New Record
            </button>
          </div>
        </div>

        {/* Glass Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
              >
                <div
                  className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl ${stat.glowClass}`}
                />
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <p className="text-[#aba9bf] text-sm font-medium">
                    {stat.title}
                  </p>
                  <Icon className={`w-5 h-5 ${stat.iconClass}`} />
                </div>
                <div className="relative z-10">
                  <h3
                    className={`text-4xl font-bold text-white tracking-tight ${
                      stat.fontMono ? "font-mono" : "font-heading"
                    }`}
                  >
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`flex items-center text-xs font-medium ${
                        stat.trendUp ? "text-[#53ddfc]" : "text-[#ff6e84]"
                      }`}
                    >
                      {stat.trendUp ? (
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                      )}
                      {stat.trend}
                    </span>
                    <span className="text-xs text-[#aba9bf]">vs last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters & Data Table Container */}
        <div className="rounded-xl bg-[#1d1d33] border border-[#e6e3fb]/10 overflow-hidden shadow-lg">
          {/* Filters Bar */}
          <div className="p-5 border-b border-[#23233b] bg-[#111124] flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9bf] w-4 h-4 z-10 pointer-events-none" />
                <select className="pl-9 pr-8 py-2 bg-[#0c0c1d] border border-[#474659]/30 rounded-lg text-sm text-[#e6e3fb] appearance-none focus:ring-1 focus:ring-[#bd9dff] focus:border-[#bd9dff] outline-none min-w-[160px]">
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>Year to Date</option>
                  <option>Custom Range...</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aba9bf] w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9bf] w-4 h-4 z-10 pointer-events-none" />
                <select className="pl-9 pr-8 py-2 bg-[#0c0c1d] border border-[#474659]/30 rounded-lg text-sm text-[#e6e3fb] appearance-none focus:ring-1 focus:ring-[#bd9dff] focus:border-[#bd9dff] outline-none min-w-[160px]">
                  <option>All Agents</option>
                  <option>Sarah Jenkins</option>
                  <option>Marcus Chen</option>
                  <option>Elena Rodriguez</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aba9bf] w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <Tags className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9bf] w-4 h-4 z-10 pointer-events-none" />
                <select className="pl-9 pr-8 py-2 bg-[#0c0c1d] border border-[#474659]/30 rounded-lg text-sm text-[#e6e3fb] appearance-none focus:ring-1 focus:ring-[#bd9dff] focus:border-[#bd9dff] outline-none min-w-[160px]">
                  <option>All Services</option>
                  <option>Enterprise Setup</option>
                  <option>Monthly Retainer</option>
                  <option>Audit & Consulting</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aba9bf] w-4 h-4 pointer-events-none" />
              </div>
            </div>
            <button className="text-sm font-medium text-[#8a4cfc] hover:text-[#bd9dff] transition-colors flex items-center gap-1 group">
              <FilterX className="w-4 h-4 transition-transform group-hover:scale-110" />
              Clear Filters
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111124]/50 border-b border-[#23233b]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading">
                    Service
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading text-right">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading">
                    Salesperson
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#aba9bf] uppercase tracking-wider font-heading text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23233b]/50">
                {salesData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${row.avatarBg}`}
                        >
                          {row.customerInitials}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm group-hover:text-[#bd9dff] transition-colors">
                            {row.customerName}
                          </div>
                          <div className="text-xs text-[#aba9bf]">
                            ID: {row.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#e6e3fb]">
                      {row.service}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-medium text-white text-right">
                      {row.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#aba9bf]">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#e6e3fb]">
                      {row.salesperson}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${row.statusBadge}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#23233b] border-t border-[#23233b]/80">
                  <td
                    className="px-6 py-4 text-right font-heading font-semibold text-white"
                    colSpan={2}
                  >
                    Period Total:
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-[#8a4cfc] text-lg">
                    $43,650.00
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-[#23233b] bg-[#111124] flex items-center justify-between">
            <span className="text-sm text-[#aba9bf]">
              Showing 1 to 5 of 1,248 entries
            </span>
            <div className="flex gap-1">
              <button
                disabled
                className="w-8 h-8 flex items-center justify-center rounded bg-[#0c0c1d] border border-[#474659]/30 text-[#aba9bf] disabled:opacity-50"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#bd9dff]/20 border border-[#bd9dff]/30 text-[#bd9dff] font-medium text-sm transition-colors">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0c0c1d] border border-[#474659]/30 text-[#e6e3fb] hover:bg-white/5 transition-colors text-sm">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0c0c1d] border border-[#474659]/30 text-[#e6e3fb] hover:bg-white/5 transition-colors text-sm">
                3
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-[#aba9bf] text-sm">
                ...
              </span>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0c0c1d] border border-[#474659]/30 text-[#e6e3fb] hover:bg-white/5 transition-colors text-sm">
                250
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0c0c1d] border border-[#474659]/30 text-[#aba9bf] hover:bg-white/5 hover:text-white transition-colors">
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
