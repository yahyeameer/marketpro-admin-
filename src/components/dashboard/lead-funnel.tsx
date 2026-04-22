"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function LeadFunnel() {
  const [counts, setCounts] = useState({ total: 0, inbound: 0, converted: 0, lost: 0 });

  useEffect(() => {
    async function fetchCounts() {
      const supabase = createClient();
      const { data } = await supabase.from("leads").select("status");
      if (data) {
        setCounts({
          total: data.length,
          inbound: data.filter((l) => l.status === "inbound").length,
          converted: data.filter((l) => l.status === "converted").length,
          lost: data.filter((l) => l.status === "lost").length,
        });
      }
    }
    fetchCounts();
  }, []);

  const funnelData = [
    { label: "Total Generated", value: counts.total.toLocaleString(), width: "100%", color: "#bd9dff" },
    { label: "Inbound / Active", value: counts.inbound.toLocaleString(), width: counts.total > 0 ? `${Math.round((counts.inbound / counts.total) * 100)}%` : "0%", color: "#53ddfc" },
    { label: "Converted", value: counts.converted.toLocaleString(), width: counts.total > 0 ? `${Math.max(8, Math.round((counts.converted / counts.total) * 100))}%` : "0%", color: "#ff6daf" },
    {
      label: "Lost",
      value: counts.lost.toLocaleString(),
      width: counts.total > 0 ? `${Math.max(5, Math.round((counts.lost / counts.total) * 100))}%` : "0%",
      color: "#ff6e84",
      glow: "0 0 10px rgba(255,110,132,0.3)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-[#474659]/15 bg-white/[0.03] backdrop-blur-[32px] p-6"
    >
      <h2 className="font-heading text-lg font-bold text-[#e6e3fb] mb-6">
        Lead Funnel
      </h2>
      <div className="space-y-6">
        {funnelData.map((item, i) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#e6e3fb] font-medium">{item.label}</span>
              <span className="text-[#e6e3fb] font-mono">{item.value}</span>
            </div>
            <div className="w-full h-2 bg-[#23233b] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: item.width }}
                transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: item.color,
                  boxShadow: item.glow || "none",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
