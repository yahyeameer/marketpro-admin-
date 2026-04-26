"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, CreditCard, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/visits", label: "Visits", icon: MapPin },
  { href: "/sales", label: "Sales", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50 lg:hidden">
      <div className="bg-white border border-[#e4e4e7] rounded-2xl p-2 flex justify-around items-center shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                isActive ? "text-[#09090b] bg-[#f4f4f5]" : "text-[#a1a1aa] hover:text-[#09090b]"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
