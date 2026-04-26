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

import { useSidebar } from "./sidebar-provider";
import { useUser } from "@/components/providers/user-provider";

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
  const { isOpen, close } = useSidebar();
  const { isAllowed } = useUser();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#f4f4f5] backdrop-blur-sm z-40 lg:hidden" 
          onClick={close} 
        />
      )}

      {/* Sidebar Navigation */}
      <nav className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col glass-panel w-[240px] h-screen border-r border-border font-heading text-sm font-medium shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Header */}
        <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-foreground leading-none">
                MarketPro
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                Admin Console
              </span>
            </div>
          </div>
          <button 
            onClick={close} 
            className="p-1 -mr-2 text-[#71717a] hover:text-[#09090b] rounded-lg lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.filter((item) => isAllowed(item.href)).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "text-primary font-bold bg-primary/10 before:absolute before:left-0 before:-ml-4 before:h-full before:w-1 before:bg-primary before:rounded-r shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
    </>
  );
}
