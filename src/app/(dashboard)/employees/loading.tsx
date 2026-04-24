export default function GenericLoading() {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <div className="h-10 w-64 bg-white/5 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-[#111124]/60 border border-[#474659]/30 rounded-xl animate-pulse" />
        ))}
      </div>

      <div className="h-96 bg-[#111124]/60 border border-[#474659]/30 rounded-xl animate-pulse" />
    </div>
  );
}
