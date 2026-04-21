"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock data based on the Stitch HTML
const employeesData = [
  {
    id: "e1",
    name: "Sarah Jenkins",
    role: "Senior Field Rep",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcOrIQot6-c1me0WWiBMa0wLmnEcjKNysnAS4pm8GRq8_S8b2mY82bjDlr26q1E-ieh1ZsNkRT-APi9zxjxkREd_rTYW1Nzg53x4c-3duzUwr2sTUrdTVzyORyJh-hLNXEjilo5tILL6x3dzw1254VXN3P3hdhVBjO7FyVQvYtlEwq3tXLZ5C7VR_bGyvn4ddf_Dr15tcAzABVR6cAI9xxbpj3YRlUSTJsP6VsL5UAO5PRlX1H3VmRleCrd-uCE6xH43wmrX3YNsI",
    metrics: {
      visits: { value: 142, trend: "+12%", up: true },
      leads: { value: 89, trend: "+5%", up: true },
      sales: { value: 45, trend: "+8%", up: true },
      revenue: { value: "$24.5k", trend: "+15%", up: true },
    },
    performance: "Excellent",
    performanceColor: "text-[#53ddfc]",
    sparklineGradients: [
      "bg-[#bd9dff]/30 h-1/3",
      "bg-[#bd9dff]/40 h-1/2",
      "bg-[#bd9dff]/50 h-[40%]",
      "bg-[#bd9dff]/70 h-3/4",
      "bg-[#bd9dff]/80 h-[85%]",
      "bg-[#53ddfc] h-full shadow-[0_0_8px_rgba(83,221,252,0.5)]",
    ],
  },
  {
    id: "e2",
    name: "Marcus Chen",
    role: "Field Rep II",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd7aaBUNCel06pIYyo0I-lw3BswIZVuMBzTyMSidHzz9U8PUOCnFtE8AdAY-zFStVPIeWZdLDfTaO4n5psgHmAQS0oQZwsdlcCTCv4wbTfF5gUfmHHjoEzZNo2jxRHf6-0TyfnyW6TwvBciaNpXSn0THhJjKErGK_PrZlzPgBCNJTp6tvcWiduPngQIPnB1-DBKnIJ7JkeTfCGBqRcFjAGnqe6vgW5WO19oFvvUY9z4JITb1LdR08a8XkoA47-HuGszw_GgFhQUsg",
    metrics: {
      visits: { value: 118, trend: "-2%", up: false },
      leads: { value: 64, trend: "+1%", up: true },
      sales: { value: 28, trend: "+4%", up: true },
      revenue: { value: "$18.2k", trend: "+6%", up: true },
    },
    performance: "Stable",
    performanceColor: "text-[#aba9bf]",
    sparklineGradients: [
      "bg-[#bd9dff]/30 h-[45%]",
      "bg-[#bd9dff]/30 h-[40%]",
      "bg-[#bd9dff]/40 h-[50%]",
      "bg-[#bd9dff]/40 h-[48%]",
      "bg-[#bd9dff]/50 h-[55%]",
      "bg-[#bd9dff]/60 h-[60%]",
    ],
  },
  {
    id: "e3",
    name: "Elena Rodriguez",
    role: "Field Rep I",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDg9NouMZQNbwdEioX1YkQX5UySCyezRgDj3n5Fn5zq0n4y1_gcLwun5qPdl1kmRxZPYpECrH7OZzYN6JG8ELS1V61DmpY7pjeZux5lW7aaWZIiomDsuPjCjzwnr1pQ_WJpKei5vvxbyJ2d-00XcMFJkG8do3IQ_49cuZGxfUlq3ghQtnruj9kSg54m0fKnV8VWZAh-bpxZkej47s4wngloahXqfHwinnvR39zZ4c6Rv_pMltaKDjmBl3y7S-cWlUg0CqbglDRRfpQ",
    metrics: {
      visits: { value: 156, trend: "+22%", up: true },
      leads: { value: 112, trend: "+18%", up: true },
      sales: { value: 31, trend: "-5%", up: false },
      revenue: { value: "$12.4k", trend: "-2%", up: false },
    },
    performance: "Volatile",
    performanceColor: "text-[#ff6daf]",
    sparklineGradients: [
      "bg-[#bd9dff]/20 h-[30%]",
      "bg-[#bd9dff]/40 h-[60%]",
      "bg-[#bd9dff]/70 h-[90%]",
      "bg-[#bd9dff]/30 h-[40%]",
      "bg-[#bd9dff]/50 h-[70%]",
      "bg-[#ff6daf] h-[45%] shadow-[0_0_8px_rgba(255,109,175,0.5)]",
    ],
  },
];

const directoryData = [
  {
    name: "Sarah Jenkins",
    avatar: employeesData[0].avatar,
    territory: "Northwest Region",
    visits: 142,
    convRate: "31.6%",
    convRateColor: "text-[#53ddfc]",
    avgDeal: "$544.44",
    revenue: "$24,500",
    statusBadge: "bg-[#53ddfc] shadow-[0_0_8px_rgba(83,221,252,0.6)]",
  },
  {
    name: "Marcus Chen",
    avatar: employeesData[1].avatar,
    territory: "Central District",
    visits: 118,
    convRate: "23.7%",
    convRateColor: "text-[#e6e3fb]",
    avgDeal: "$650.00",
    revenue: "$18,200",
    statusBadge: "bg-[#bd9dff] shadow-[0_0_8px_rgba(189,157,255,0.6)]",
  },
  {
    name: "Elena Rodriguez",
    avatar: employeesData[2].avatar,
    territory: "South Metro",
    visits: 156,
    convRate: "19.8%",
    convRateColor: "text-[#ff6e84]",
    avgDeal: "$400.00",
    revenue: "$12,400",
    statusBadge: "bg-[#ff6daf] shadow-[0_0_8px_rgba(255,109,175,0.6)]",
  },
  {
    name: "James Donovan",
    initials: "JD",
    territory: "East Coast",
    visits: 94,
    convRate: "28.5%",
    convRateColor: "text-[#e6e3fb]",
    avgDeal: "$710.20",
    revenue: "$19,100",
    statusBadge: "bg-[#bd9dff] shadow-[0_0_8px_rgba(189,157,255,0.6)]",
  },
];

export default function EmployeesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 lg:p-8 xl:p-10 relative z-10"
    >
      {/* Liquid Light Orbs (Employees BG) */}
      <div
        className="fixed top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(64,206,237,0.15) 0%, rgba(12,12,29,0) 70%)",
        }}
      />
      <div
        className="fixed bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(250,83,164,0.12) 0%, rgba(12,12,29,0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#e6e3fb] tracking-tight mb-1">
              Employee Performance
            </h1>
            <p className="text-[#aba9bf] text-sm">
              Real-time metrics and historical KPI data for field staff.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-lg flex items-center px-3 py-1.5 text-sm cursor-pointer hover:bg-white/10 transition-colors">
              <Calendar className="w-4 h-4 text-[#aba9bf] mr-2" />
              <span className="text-[#e6e3fb] font-medium">Last 30 Days</span>
              <ChevronDown className="w-4 h-4 text-[#aba9bf] ml-2" />
            </div>
            <button className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] text-[#000000] font-medium text-sm px-4 py-1.5 rounded-lg hover:shadow-[0_0_15px_rgba(189,157,255,0.4)] transition-all">
              Export Data
            </button>
          </div>
        </div>

        {/* Employee Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {employeesData.map((emp) => (
            <div
              key={emp.id}
              className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-5 shadow-[0_0_40px_rgba(138,76,252,0.08)] flex flex-col group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full overflow-hidden border border-[#474659]/30 object-cover"
                  />
                  <div>
                    <h3 className="font-heading text-base font-bold text-[#e6e3fb]">
                      {emp.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#bd9dff]/10 text-[#bd9dff] border border-[#bd9dff]/20">
                      {emp.role}
                    </span>
                  </div>
                </div>
                <button className="text-[#aba9bf] hover:text-[#e6e3fb]">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* internal metrics grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                {[
                  { label: "Visits", ...emp.metrics.visits, isPrimary: false },
                  { label: "Leads", ...emp.metrics.leads, isPrimary: false },
                  { label: "Sales", ...emp.metrics.sales, isPrimary: false },
                  { label: "Revenue", ...emp.metrics.revenue, isPrimary: true },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-[#111124]/50 rounded-lg p-3"
                  >
                    <p className="text-xs text-[#aba9bf] mb-1">{metric.label}</p>
                    <p
                      className={`font-heading text-lg font-bold font-mono tracking-tight ${
                        metric.isPrimary ? "text-[#bd9dff]" : "text-[#e6e3fb]"
                      }`}
                    >
                      {metric.value}
                    </p>
                    <p
                      className={`text-[10px] mt-1 flex items-center ${
                        metric.up ? "text-[#53ddfc]" : "text-[#ff6e84]"
                      }`}
                    >
                      {metric.up ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}{" "}
                      {metric.trend}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto border-t border-[#474659]/10 pt-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#aba9bf]">Performance Trend</span>
                  <span className={emp.performanceColor}>{emp.performance}</span>
                </div>
                <div className="w-full h-8 flex items-end gap-1">
                  {emp.sparklineGradients.map((gradClass, idx) => (
                    <div
                      key={idx}
                      className={`w-1/6 rounded-t-sm ${gradClass}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed KPI Table */}
        <div className="bg-white/[0.06] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(138,76,252,0.08)]">
          <div className="px-6 py-4 border-b border-[#474659]/15 flex justify-between items-center bg-[#111124]/30">
            <h2 className="font-heading text-lg font-bold text-[#e6e3fb]">
              Comprehensive KPI Directory
            </h2>
            <button className="text-sm text-[#bd9dff] hover:text-[#b28cff] transition-colors flex items-center gap-1 font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-[#aba9bf] uppercase tracking-wider bg-[#000000]/50">
                  <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb]">
                    Employee
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb]">
                    Territory
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb] text-right">
                    Total Visits
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb] text-right">
                    Conv. Rate
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb] text-right">
                    Avg Deal Size
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:text-[#e6e3fb] text-right">
                    Total Revenue
                  </th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#474659]/10">
                {directoryData.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[#23233b]/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#23233b] flex items-center justify-center font-bold text-[#bd9dff] text-xs">
                          {row.avatar ? (
                            <img
                              src={row.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            row.initials
                          )}
                        </div>
                        <span className="font-medium text-[#e6e3fb]">
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#aba9bf]">{row.territory}</td>
                    <td className="px-6 py-4 text-right font-mono">
                      {row.visits}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-mono ${row.convRateColor}`}
                    >
                      {row.convRate}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {row.avgDeal}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                      {row.revenue}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${row.statusBadge}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-[#474659]/15 flex justify-between items-center text-xs text-[#aba9bf] bg-[#000000]/30">
            <span>Showing 1-4 of 42 Employees</span>
            <div className="flex gap-2">
              <button
                disabled
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#23233b] transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center bg-[#bd9dff]/20 text-[#bd9dff] font-medium">
                1
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#23233b] text-[#e6e3fb] transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#23233b] text-[#e6e3fb] transition-colors">
                3
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#23233b] text-[#e6e3fb] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
