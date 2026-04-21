"use client";

import { motion } from "framer-motion";

const funnelData = [
  { label: "Total Generated", value: "12,400", width: "100%", color: "#bd9dff" },
  { label: "Contacted", value: "8,150", width: "65%", color: "#53ddfc" },
  { label: "Qualified", value: "3,200", width: "25%", color: "#ff6daf" },
  {
    label: "Converted",
    value: "842",
    width: "8%",
    color: "#48d4f3",
    glow: "0 0 10px rgba(72, 212, 243, 0.5)",
  },
];

export function LeadFunnel() {
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
