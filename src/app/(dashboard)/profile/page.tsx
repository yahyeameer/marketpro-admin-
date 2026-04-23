"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, Award, Target, TrendingUp } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({ visits: 0, sales: 0 });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      const supabase = createClient();
      const [visitsRes, salesRes] = await Promise.all([
        supabase.from("field_visits").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("sales").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStats({
        visits: visitsRes.count || 0,
        sales: salesRes.count || 0,
      });
    }
    fetchStats();
  }, [user]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      {/* Profile Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#bd9dff] to-[#ff6daf] flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_40px_rgba(189,157,255,0.4)]">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#0c0c1d] border border-white/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#53ddfc]" />
          </div>
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">{user?.name}</h1>
          <p className="text-[#aba9bf] text-sm uppercase tracking-widest font-semibold">{user?.role}</p>
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-[32px] p-8 space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <Mail className="w-6 h-6 text-[#bd9dff]" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-[#aba9bf] tracking-widest">Email Address</p>
            <p className="text-[#e6e3fb] font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <Shield className="w-6 h-6 text-[#53ddfc]" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-[#aba9bf] tracking-widest">Permissions Role</p>
            <p className="text-[#e6e3fb] font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-[32px] p-6 text-center"
        >
          <Award className="w-8 h-8 text-[#ff6daf] mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.visits}</p>
          <p className="text-[10px] uppercase font-bold text-[#aba9bf] tracking-widest">Total Visits</p>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-[32px] p-6 text-center"
        >
          <Target className="w-8 h-8 text-[#53ddfc] mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.sales}</p>
          <p className="text-[10px] uppercase font-bold text-[#aba9bf] tracking-widest">Total Sales</p>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-5 h-5 text-[#ff6e84]" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
