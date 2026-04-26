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
    { label: "Total Generated", value: counts.total.toLocaleString('en-US'), width: "100%", color: "#ffffff" },
    { label: "Inbound / Active", value: counts.inbound.toLocaleString('en-US'), width: counts.total > 0 ? `${Math.round((counts.inbound / counts.total) * 100)}%` : "0%", color: "#27272a" },
    { label: "Converted", value: counts.converted.toLocaleString('en-US'), width: counts.total > 0 ? `${Math.max(8, Math.round((counts.converted / counts.total) * 100))}%` : "0%", color: "#52525b" },
    {
      label: "Lost",
      value: counts.lost.toLocaleString('en-US'),
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
      className="rounded-xl border border-[#e4e4e7]/15 bg-[#f4f4f5] backdrop-blur-[32px] p-6"
    >
      <h2 className="font-heading text-lg font-bold text-[#09090b] mb-6">
        Lead Funnel
      </h2>
      <div className="space-y-6">
        {funnelData.map((item, i) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#09090b] font-medium">{item.label}</span>
              <span className="text-[#09090b] font-mono">{item.value}</span>
            </div>
            <div className="w-full h-2 bg-[#e4e4e7] rounded-full overflow-hidden">
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
