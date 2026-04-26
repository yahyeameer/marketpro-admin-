export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-10 relative z-10 min-h-screen">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 bg-[#09090b]/5 rounded animate-pulse" />
        <div className="h-6 w-32 bg-[#09090b]/5 rounded-full animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-[#f4f4f5] border border-[#e4e4e7] rounded-2xl animate-pulse" />
        ))}
      </div>

      <div className="flex flex-wrap gap-4 relative z-10">
        <div className="flex-1 min-w-[140px] h-16 bg-[#09090b]/5 rounded-2xl animate-pulse" />
        <div className="flex-1 min-w-[140px] h-16 bg-[#09090b]/5 rounded-2xl animate-pulse" />
      </div>

      <div className="h-64 bg-[#f4f4f5] border border-[#e4e4e7] rounded-3xl animate-pulse" />
    </div>
  );
}
