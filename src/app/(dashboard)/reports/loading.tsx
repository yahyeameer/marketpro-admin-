export default function ReportsLoading() {
  return (
    <div className="p-6 lg:p-8 relative z-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="h-8 w-64 bg-white/5 rounded animate-pulse mb-2" />
          <div className="flex gap-4">
            <div className="h-6 w-20 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-[#111124]/60 border border-[#474659]/30 rounded-2xl animate-pulse" />
          ))}
        </div>
        
        <div className="lg:col-span-8 h-80 bg-[#111124]/60 border border-[#474659]/30 rounded-2xl animate-pulse" />
        <div className="lg:col-span-4 h-80 bg-[#111124]/60 border border-[#474659]/30 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
