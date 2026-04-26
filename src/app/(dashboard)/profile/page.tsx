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
          <div className="w-24 h-24 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-primary/30">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl glass-panel border border-border flex items-center justify-center shadow-sm">
            <Shield className="w-4 h-4 text-primary" />
          </div>
        </motion.div>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground font-heading">{user?.name}</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold mt-1">{user?.role}</p>
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-3xl border-border/50 p-8 space-y-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Email Address</p>
            <p className="text-foreground font-bold">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Permissions Role</p>
            <p className="text-foreground font-bold capitalize">{user?.role}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl border-border/50 p-6 text-center shadow-sm"
        >
          <Award className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground font-mono">{stats.visits}</p>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Total Visits</p>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl border-border/50 p-6 text-center shadow-sm"
        >
          <Target className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-extrabold text-foreground font-mono">{stats.sales}</p>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Total Sales</p>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass-panel border border-border/50 text-foreground font-bold hover:bg-muted/50 transition-colors shadow-sm hover:shadow"
        >
          <LogOut className="w-5 h-5 text-destructive" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
