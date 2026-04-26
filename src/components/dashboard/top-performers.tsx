"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Performer {
  name: string;
  role: string;
  visits: number;
  revenue: string;
  trend: "up" | "neutral";
  initials: string;
  avatarGradient: string;
  ringColor: string;
}

const gradients = [
  { avatarGradient: "bg-[#09090b] text-white", ringColor: "ring-[#ffffff]/20" },
  { avatarGradient: "from-[#52525b] to-[#fa53a4]", ringColor: "ring-[#52525b]/20" },
  { avatarGradient: "from-[#27272a] to-[#40ceed]", ringColor: "ring-[#757388]/20" },
  { avatarGradient: "from-[#4ade80] to-[#22c55e]", ringColor: "ring-[#4ade80]/20" },
  { avatarGradient: "from-[#fbbf24] to-[#f59e0b]", ringColor: "ring-[#fbbf24]/20" },
];

export function TopPerformers() {
  const [performers, setPerformers] = useState<Performer[]>([]);

  useEffect(() => {
    async function fetchPerformers() {
      const supabase = createClient();

      // Get all users
      const { data: users } = await supabase.from("users").select("id, name, role");
      if (!users) return;

      // Get sales with user_id
      const { data: sales } = await supabase.from("sales").select("user_id, price");
      // Get visits with user_id
      const { data: visits } = await supabase.from("field_visits").select("user_id");

      const performerData: Performer[] = users.map((user, index) => {
        const userSales = sales?.filter((s) => s.user_id === user.id) || [];
        const userVisits = visits?.filter((v) => v.user_id === user.id) || [];
        const totalRev = userSales.reduce((sum, s) => sum + Number(s.price || 0), 0);
        const grad = gradients[index % gradients.length];

        return {
          name: user.name,
          role: user.role === "admin" ? "Director" : "Field Rep",
          visits: userVisits.length,
          revenue: totalRev >= 1000 ? `$${(totalRev / 1000).toFixed(1)}k` : `$${totalRev.toFixed(0)}`,
          trend: userVisits.length > 2 ? "up" : "neutral",
          initials: user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase(),
          ...grad,
        };
      });

      // Sort by revenue descending
      performerData.sort((a, b) => {
        const parseRev = (r: string) => {
          const n = parseFloat(r.replace("$", "").replace("k", ""));
          return r.includes("k") ? n * 1000 : n;
        };
        return parseRev(b.revenue) - parseRev(a.revenue);
      });

      setPerformers(performerData.slice(0, 5));
    }
    fetchPerformers();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-xl border border-[#e4e4e7]/15 bg-[#f4f4f5] backdrop-blur-[32px] p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-lg font-bold text-[#09090b]">
          Top Performers
        </h2>
        <Link href="/employees" className="text-sm font-medium text-[#09090b] hover:text-[#d4d4d8] transition-colors">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-[#71717a] border-b border-[#e4e4e7]/20 uppercase tracking-wider">
              <th className="pb-3 font-medium px-4">Agent</th>
              <th className="pb-3 font-medium px-4 text-right">Visits</th>
              <th className="pb-3 font-medium px-4 text-right">Revenue</th>
              <th className="pb-3 font-medium pl-4 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {performers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#71717a]">
                  <div className="w-5 h-5 border-2 border-[#e4e4e7] border-t-[#09090b] rounded-full animate-spin mx-auto mb-2" />
                  Loading...
                </td>
              </tr>
            ) : (
              performers.map((p, i) => (
                <tr
                  key={p.name}
                  className={`hover:bg-[#09090b]/5 transition-colors group ${
                    i < performers.length - 1 ? "border-b border-[#e4e4e7]/10" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.avatarGradient} ring-2 ${p.ringColor} flex items-center justify-center text-[#09090b] text-xs font-bold`}
                      >
                        {p.initials}
                      </div>
                      <div>
                        <p className="font-medium text-[#09090b]">{p.name}</p>
                        <p className="text-xs text-[#71717a]">{p.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#09090b]">
                    {p.visits}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#09090b]">
                    {p.revenue}
                  </td>
                  <td className="py-3 pl-4 text-center">
                    {p.trend === "up" ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f4f4f5]/10 text-[#27272a]">
                        <ArrowUp className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f4f4f5]/30 text-[#71717a]">
                        <Minus className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
