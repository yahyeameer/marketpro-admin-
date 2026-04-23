"use client";

import { useEffect, useState } from "react";
import { MapPin, ShoppingCart, CreditCard, Plus, Clock, CheckCircle2 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/components/providers/user-provider";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useUser();
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

      const totalVisits = visitsRes.count || 0;
      const totalSales = salesRes.data?.length || 0;
      const totalRevenue = salesRes.data?.reduce((sum, s) => sum + Number(s.price || 0), 0) || 0;

      setKpis({ visits: totalVisits, sales: totalSales, revenue: totalRevenue });

      // Fetch recent activities (mocking some logic for now based on last 5 entries in sales and visits)
      const { data: recentSales } = await supabase
        .from("sales")
        .select("customer, service, sale_date")
        .order("sale_date", { ascending: false })
        .limit(3);
      
      const { data: recentVisits } = await supabase
        .from("field_visits")
        .select("client_name, status, visit_date")
        .order("visit_date", { ascending: false })
        .limit(2);

      const combined = [
        ...(recentSales?.map(s => ({ type: 'sale', title: `Sale: ${s.customer}`, sub: s.service, time: s.sale_date, status: 'completed' })) || []),
        ...(recentVisits?.map(v => ({ type: 'visit', title: `Visit: ${v.client_name}`, sub: v.status, time: v.visit_date, status: v.status })) || [])
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
    <div className="space-y-8 pb-10">
      {/* Header with Greeting & Role */}
      <div className="flex flex-col gap-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#e6e3fb]">
            {getGreeting()}, {user?.name?.split(' ')[0] || "Ahmed"} 👋
          </h1>
        </motion.div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#bd9dff]/10 border border-[#bd9dff]/20 text-[#bd9dff] text-xs font-semibold uppercase tracking-wider">
            {user?.role === 'admin' ? 'Field Marketer' : 'Sales Agent'}
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
          glowColor="rgba(189, 157, 255, 0.1)"
          orbColor="#bd9dff"
          iconColor="#bd9dff"
        />
        <KpiCard
          title="Sales Today"
          value={kpis.sales.toString()}
          icon={ShoppingCart}
          trend="+4.2%"
          trendDirection="up"
          glowColor="rgba(255, 109, 175, 0.1)"
          orbColor="#ff6daf"
          iconColor="#ff6daf"
        />
        <KpiCard
          title="Revenue Today"
          value={formatCurrency(kpis.revenue)}
          icon={CreditCard}
          trend="+12.1%"
          trendDirection="up"
          glowColor="rgba(83, 221, 252, 0.1)"
          orbColor="#53ddfc"
          iconColor="#53ddfc"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="flex-1 min-w-[140px] bg-gradient-to-br from-[#bd9dff] to-[#7C3AED] text-white py-4 rounded-2xl font-bold shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          New Visit
        </button>
        <button className="flex-1 min-w-[140px] bg-gradient-to-br from-[#53ddfc] to-[#0ea5e9] text-white py-4 rounded-2xl font-bold shadow-[0_8px_24px_rgba(14,165,233,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          New Sale
        </button>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-3xl border border-[#474659]/15 bg-white/[0.03] backdrop-blur-[32px] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#aba9bf]" />
            Recent Activity
          </h2>
          <button className="text-xs font-semibold text-[#bd9dff] hover:underline">View All</button>
        </div>
        <div className="divide-y divide-white/5">
          {activities.length > 0 ? activities.map((activity, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'sale' ? 'bg-[#ff6daf]/10 text-[#ff6daf]' : 'bg-[#bd9dff]/10 text-[#bd9dff]'
                }`}>
                  {activity.type === 'sale' ? <ShoppingCart className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activity.title}</h3>
                  <p className="text-xs text-[#aba9bf]">{activity.sub}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-[#aba9bf] uppercase font-medium">
                  {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#65e1ff]" />
                  <span className="text-[10px] text-[#65e1ff] font-bold uppercase tracking-wider">{activity.status}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="p-8 text-center text-[#aba9bf] text-sm italic">
              No recent activity found for today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
