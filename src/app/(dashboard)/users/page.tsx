"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Radar,
  Hourglass,
  MoreVertical,
  Edit2,
  Trash2,
  TrendingUp,
  X,
  Mail,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const usersData = [
  {
    id: "1",
    name: "Sarah Jenkins",
    email: "sarah.j@marketpro.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhm5NV-lzwdu1UL4PAIjbIx4FIM2_7PksfS0xNK-45RLwIG1aZbfZFffyRnXnkD-Pfk3Pa-62Pr6bUX2WQPAueGMSf5iie42sULxQJ7gFZmBq-E7McSWmgi5AuU-AvPhrPDIOxL41OrVIzmrySeeEdo53T1FLhEXu4CwXwu9-7we6HhkdDSnUpyFswcxx2unXlgfMPyCvp5hC33PFhBSaJZv6pAOskrIXgEtZ-B3FesVqDAVBbLfoIwS07giQIN2o270O5njGhKHA",
    role: "Admin",
    roleColor: "bg-[#bd9dff]/10 text-[#bd9dff] border-[#bd9dff]/20",
    status: "Active",
    statusBadge: "bg-[#40ceed] shadow-[0_0_5px_rgba(64,206,237,0.8)]",
    statusColor: "text-[#e6e3fb]",
    lastLogin: "Just now",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "m.chen@marketpro.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRc1mAQlgKuZSls_lDrZwI1gowvUecZseGpnuLx1Zz5oUzOtKu2IhfAoAHjrZF32pFIUURW_DzMuWyH25zSuzgWmkcYCRIUbs5xiLsPXrVA2lBvP9AExTP_FmeO-EFwH9uMTu9eS_Goj88_gowr_bk-OH1V8D-JgGxHDxl6MWyiaF8rnUiXeWTcXMAFSKLytLb7eW3W5pi9zoOmkd74KRmTW2UXDNwI_EkScQBpk8jf_0-jyfWsiORfYLPsBJfaA8JX3a3jL8mh_Y",
    role: "Manager",
    roleColor: "bg-[#53ddfc]/10 text-[#53ddfc] border-[#53ddfc]/20",
    status: "Active",
    statusBadge: "bg-[#40ceed] shadow-[0_0_5px_rgba(64,206,237,0.8)]",
    statusColor: "text-[#e6e3fb]",
    lastLogin: "2 hrs ago",
  },
  {
    id: "3",
    name: "Elena Diaz",
    email: "elena.d@marketpro.com",
    initials: "ED",
    role: "Field Marketer",
    roleColor: "bg-[#ff6daf]/10 text-[#ff6daf] border-[#ff6daf]/20",
    status: "Offline",
    statusBadge: "bg-[#757388]",
    statusColor: "text-[#aba9bf]",
    lastLogin: "1 day ago",
  },
  {
    id: "4",
    name: "David Kim",
    email: "dkim@marketpro.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCd9-XU80O0v8k2BEweSRcoAuVvbG2bOQ6R11ox3JtOS9CN_2QcJ6IeRqwzgSQ9DjjWVot__TdZEgH4IMsxJ-qSzUayodK3U217wL65zVVZYvG9MLF1lL3sN2uAYxGdktEMVE86x_JkJdzoDDy6lyLZ51obC-W73ZHn3NMYXvhrCyWqXAZUU3I3IabJiMRBPJ-Nxenv4EWTCJhfo9fvpgUwarxsBjUQO6ZxrTVSXpoQ1XVA0SoxSj3jtCd84yluD8rTj0g7lWPxzMc",
    role: "Sales Agent",
    roleColor: "bg-[#40ceed]/10 text-[#40ceed] border-[#40ceed]/20",
    status: "Suspended",
    statusBadge: "bg-[#d73357]",
    statusColor: "text-[#d73357]",
    lastLogin: "Oct 12, 2023",
  },
];

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 lg:p-8 xl:p-10 relative z-10 flex flex-col min-h-[calc(100vh-64px)]"
    >
      {/* Liquid Light Orbs */}
      <div
        className="fixed top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(64, 206, 237, 0.15) 0%, rgba(64, 206, 237, 0) 70%)",
        }}
      />
      <div
        className="fixed bottom-[-200px] left-[100px] w-[800px] h-[800px] rounded-full pointer-events-none z-0 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 83, 164, 0.1) 0%, rgba(250, 83, 164, 0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 shrink-0">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight mb-2 text-[#e6e3fb]">
              User Management
            </h1>
            <p className="text-[#aba9bf] text-sm max-w-lg">
              Manage access controls, assign roles, and monitor active sessions
              across the MarketPro ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors text-[#e6e3fb]">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0c0c1d] flex items-center gap-2 hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Metric Cards Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 shrink-0">
          {/* Card 1 */}
          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#bd9dff]/10 rounded-full blur-2xl group-hover:bg-[#bd9dff]/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#aba9bf] text-sm font-medium">
                Total Users
              </span>
              <span className="text-[#bd9dff]/70 bg-[#bd9dff]/10 p-1.5 rounded-md">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="font-heading text-3xl font-bold tracking-tight text-[#e6e3fb] font-mono">
              1,248
            </div>
            <div className="mt-2 text-xs text-[#53ddfc] flex items-center font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#53ddfc]/10 rounded-full blur-2xl group-hover:bg-[#53ddfc]/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#aba9bf] text-sm font-medium">
                Active Sessions
              </span>
              <span className="text-[#53ddfc]/70 bg-[#53ddfc]/10 p-1.5 rounded-md">
                <Radar className="w-4 h-4" />
              </span>
            </div>
            <div className="font-heading text-3xl font-bold tracking-tight text-[#e6e3fb] font-mono">
              342
            </div>
            <div className="mt-2 text-xs text-[#aba9bf] flex items-center font-medium">
              Currently online
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl p-6 relative overflow-hidden group hover:bg-white/5 transition-colors shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#ff6e84]/10 rounded-full blur-2xl group-hover:bg-[#ff6e84]/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#aba9bf] text-sm font-medium">
                Pending Approvals
              </span>
              <span className="text-[#ff6e84]/70 bg-[#ff6e84]/10 p-1.5 rounded-md">
                <Hourglass className="w-4 h-4" />
              </span>
            </div>
            <div className="font-heading text-3xl font-bold tracking-tight text-[#e6e3fb] font-mono">
              18
            </div>
            <div className="mt-2 text-xs text-[#d73357] flex items-center font-medium">
              Action required
            </div>
          </div>
        </div>

        {/* Users Table Container */}
        <div className="bg-white/[0.03] backdrop-blur-[32px] border border-[#474659]/30 rounded-xl flex-1 flex flex-col overflow-hidden relative shadow-[0_4px_60px_rgba(138,76,252,0.04)]">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#111124]/50">
            <h2 className="font-heading text-lg font-semibold text-[#e6e3fb]">
              Directory
            </h2>
            <button className="text-[#aba9bf] hover:text-[#e6e3fb] p-1 rounded transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs text-[#aba9bf] uppercase tracking-wider bg-[#111124]/30">
                  <th className="py-4 px-6 font-medium">User</th>
                  <th className="py-4 px-6 font-medium">Role</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium">Last Login</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {usersData.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#474659]/30 shrink-0 bg-[#23233b] flex items-center justify-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-[#ff6daf]">
                              {user.initials}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#e6e3fb]">
                            {user.name}
                          </div>
                          <div className="text-xs text-[#aba9bf]">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${user.roleColor}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${user.statusBadge}`}
                        />
                        <span className={`text-xs font-medium ${user.statusColor}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#aba9bf] text-xs font-mono">
                      {user.lastLogin}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[#aba9bf] hover:text-[#e6e3fb] transition-colors p-1">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-[#aba9bf] hover:text-[#ff6e84] transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-[#aba9bf] bg-[#111124]/30">
            <div>
              Showing <span className="font-mono text-[#e6e3fb]">1</span> to{" "}
              <span className="font-mono text-[#e6e3fb]">4</span> of{" "}
              <span className="font-mono text-[#e6e3fb]">1,248</span> results
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="p-1 hover:text-[#e6e3fb] hover:bg-white/5 rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-6 h-6 rounded bg-[#bd9dff]/20 text-[#bd9dff] font-medium flex items-center justify-center">
                1
              </button>
              <button className="w-6 h-6 rounded hover:bg-white/5 hover:text-[#e6e3fb] flex items-center justify-center">
                2
              </button>
              <button className="w-6 h-6 rounded hover:bg-white/5 hover:text-[#e6e3fb] flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-[#aba9bf]">...</span>
              <button className="p-1 hover:text-[#e6e3fb] hover:bg-white/5 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Modal for Add User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c1d]/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(189,157,255,0.08)] relative bg-[#18182b] border border-[#474659]/30"
          >
            {/* Modal specific orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#bd9dff]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
              <h3 className="font-heading text-xl font-bold text-[#e6e3fb]">
                Add New User
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#aba9bf] hover:text-[#e6e3fb] transition-colors p-1 rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#aba9bf]">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#aba9bf]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#aba9bf]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-[#aba9bf] w-4 h-4" />
                  <input
                    type="email"
                    placeholder="jane.doe@marketpro.com"
                    className="w-full bg-[#111124] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all placeholder:text-[#aba9bf]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#aba9bf]">
                  Role Assignment
                </label>
                <select
                  defaultValue=""
                  className="w-full bg-[#111124] border border-white/5 rounded-lg px-3 py-2 text-sm text-[#e6e3fb] focus:border-[#53ddfc]/50 focus:ring-1 focus:ring-[#53ddfc]/50 focus:outline-none transition-all cursor-pointer"
                >
                  <option disabled value="">
                    Select a role...
                  </option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="field">Field Marketer</option>
                  <option value="sales">Sales Agent</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-[#000000]/30 relative z-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#e6e3fb] hover:bg-white/5 transition-colors border border-white/5"
              >
                Cancel
              </button>
              <button className="bg-gradient-to-br from-[#bd9dff] to-[#53ddfc] px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0c0c1d] hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all">
                Create User
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
