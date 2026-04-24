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

      <div className="bg-white/[0.06] border border-[#474659]/30 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="h-10 w-48 bg-white/5 rounded animate-pulse" />
        <div className="h-10 w-64 bg-white/5 rounded animate-pulse ml-auto" />
      </div>

      <div className="h-96 bg-[#111124]/60 border border-[#474659]/30 rounded-xl animate-pulse" />
    </div>
  );
}
