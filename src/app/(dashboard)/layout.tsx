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
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white">
        <div className="absolute -top-[10%] -right-[5%] w-[60vw] h-[60vw] rounded-full bg-[#f4f4f5] opacity-[0.5] blur-[100px] will-change-transform transform-gpu" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#e4e4e7] opacity-[0.3] blur-[100px] will-change-transform transform-gpu" />
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
