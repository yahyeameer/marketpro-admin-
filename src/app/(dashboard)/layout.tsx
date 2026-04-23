import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { BottomNavbar } from "@/components/dashboard/bottom-navbar";
import { SidebarProvider } from "@/components/dashboard/sidebar-provider";
import { UserProvider } from "@/components/providers/user-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Liquid Background Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0c0c1d]">
        <div className="absolute -top-[10%] -right-[5%] w-[60vw] h-[60vw] rounded-full bg-[#bd9dff] opacity-[0.15] blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#53ddfc] opacity-[0.15] blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-[#ff6daf] opacity-[0.15] blur-[120px]" />
      </div>

      <UserProvider>
        <SidebarProvider>
          <Sidebar />
          <TopNavbar />

          <main className="lg:pl-[240px] pt-16 min-h-screen transition-all duration-300 pb-28 lg:pb-0">
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8">
              {children}
            </div>
          </main>

          <BottomNavbar />
        </SidebarProvider>
      </UserProvider>
    </>
  );
}
