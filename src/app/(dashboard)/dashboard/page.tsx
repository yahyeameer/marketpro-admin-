"use client";

import { useEffect, useState } from "react";
import { MapPin, ShoppingCart, CreditCard, Plus, Clock, CheckCircle2 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/components/providers/user-provider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [kpis, setKpis] = useState({
    visits: 0,
    sales: 0,
    revenue: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's KPIs
      const [visitsRes, salesRes] = await Promise.all([
        supabase.from("field_visits").select("id", { count: "exact", head: true }).gte("visit_date", today),
        supabase.from("sales").select("price").gte("sale_date", today),
      ]);

      if (visitsRes.error) console.error("Error fetching today's visits:", visitsRes.error);
      if (salesRes.error) console.error("Error fetching today's sales:", salesRes.error);

      const totalVisits = visitsRes.count || 0;
      const totalSales = salesRes.data?.length || 0;
      const totalRevenue = salesRes.data?.reduce((sum, s) => sum + Number(s.price || 0), 0) || 0;

      setKpis({ visits: totalVisits, sales: totalSales, revenue: totalRevenue });

      // Fetch recent activities
      const [recentSalesRes, recentVisitsRes] = await Promise.all([
        supabase
          .from("sales")
          .select("customer, service, sale_date")
          .order("sale_date", { ascending: false })
          .limit(3),
        supabase
          .from("field_visits")
          .select("company, status, visit_date")
          .order("visit_date", { ascending: false })
          .limit(2)
      ]);
      
      const recentSales = recentSalesRes.data;
      const recentVisits = recentVisitsRes.data;

      const combined = [
        ...(recentSales?.map(s => ({ type: 'sale', title: `Sale: ${s.customer}`, sub: s.service, time: s.sale_date, status: 'completed' })) || []),
        ...(recentVisits?.map(v => ({ type: 'visit', title: `Visit: ${v.company}`, sub: v.status, time: v.visit_date, status: v.status })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setActivities(combined);
    }
    fetchData();
  }, []);

  const formatCurrency = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 pb-10 relative z-10 min-h-screen">
      {/* Background Liquid Light Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-[80px] opacity-30 bg-primary/20 text-white will-change-transform transform-gpu" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[80px] opacity-20 bg-gradient-to-tr from-accent/20 to-primary/10 will-change-transform transform-gpu" />

      {/* Header with Greeting & Role */}
      <div className="flex flex-col gap-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground drop-shadow-sm">
            {getGreeting()}, {user?.name?.split(' ')[0] || "Admin"} 👋
          </h1>
        </motion.div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
            {user?.role === 'admin' ? 'System Administrator' : 'Sales Agent'}
          </span>
        </div>
      </div>

      {/* KPI Row - Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Visits Today"
          value={kpis.visits.toString()}
          icon={MapPin}
          trend="+2.5%"
          trendDirection="up"
          glowColor="rgba(99, 102, 241, 0.15)"
          orbColor="#6366F1"
          iconColor="#6366F1"
        />
        <KpiCard
          title="Sales Today"
          value={kpis.sales.toString()}
          icon={ShoppingCart}
          trend="+4.2%"
          trendDirection="up"
          glowColor="rgba(129, 140, 248, 0.15)"
          orbColor="#818CF8"
          iconColor="#818CF8"
        />
        <KpiCard
          title="Revenue Today"
          value={formatCurrency(kpis.revenue)}
          icon={CreditCard}
          trend="+12.1%"
          trendDirection="up"
          glowColor="rgba(16, 185, 129, 0.15)"
          orbColor="#10B981"
          iconColor="#10B981"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 relative z-10">
        <button onClick={() => router.push("/visits")} className="group relative flex-1 min-w-[140px] bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-primary/30">
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:animate-shimmer pointer-events-none" />
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10 tracking-wide drop-shadow-sm">New Visit</span>
        </button>
        <button onClick={() => router.push("/sales")} className="group relative flex-1 min-w-[140px] bg-accent text-accent-foreground py-4 rounded-2xl font-bold hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-accent/30">
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:animate-shimmer pointer-events-none" />
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10 tracking-wide drop-shadow-sm">New Sale</span>
        </button>
      </div>

      {/* Recent Activity Feed */}
      <div className="relative z-10 rounded-3xl glass-panel overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold text-foreground flex items-center gap-2 tracking-tight">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            Activity Stream
          </h2>
          <button onClick={() => router.push("/reports")} className="text-xs font-semibold text-primary hover:text-primary-foreground transition-colors bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary shadow-sm hover:shadow-md">View All</button>
        </div>
        <div className="divide-y divide-border/30">
          {activities.length > 0 ? activities.map((activity, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                  activity.type === 'sale' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-primary/10 text-primary border border-primary/20'
                }`}>
                  {activity.type === 'sale' ? <ShoppingCart className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{activity.title}</h3>
                  <p className="text-xs text-muted-foreground">{activity.sub}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-medium">
                  {new Date(activity.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                  <span className="text-[10px] text-accent font-bold uppercase tracking-wider">{activity.status}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="p-8 text-center text-muted-foreground text-sm italic">
              No recent activity found for today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
