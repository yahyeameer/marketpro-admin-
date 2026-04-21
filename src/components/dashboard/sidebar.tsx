"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  CreditCard,
  UserPlus,
  BadgeCheck,
  FileBarChart,
  UserCog,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/visits", label: "Field Visits", icon: MapPin },
  { href: "/sales", label: "Sales", icon: CreditCard },
  { href: "/leads", label: "Leads", icon: UserPlus },
  { href: "/employees", label: "Employees", icon: BadgeCheck },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/users", label: "User Management", icon: UserCog },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white/5 backdrop-blur-xl w-[240px] h-screen border-r border-white/10 font-heading text-sm font-medium shadow-[0_0_40px_rgba(124,58,237,0.08)]">
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bd9dff] to-[#ff6daf] flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-white leading-none">
              MarketPro
            </span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
              Admin Console
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "text-white font-bold bg-white/5 before:absolute before:left-0 before:-ml-4 before:h-full before:w-1 before:bg-[#7C3AED] before:shadow-[4px_0_12px_rgba(124,58,237,0.5)]"
                    : "text-white/50 hover:text-white hover:bg-white/5 hover:backdrop-blur-md"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-[#7C3AED]" : ""}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
