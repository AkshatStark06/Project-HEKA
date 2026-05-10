function KPICard({ title, value }) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-slate-800
        bg-slate-900/90
        p-6
        shadow-lg shadow-black/20
        transition-all duration-300
        hover:border-slate-700
        hover:shadow-2xl hover:shadow-black/30
      "
    >
      <div className="space-y-4">
        
        <div>
          <p className="text-sm font-medium tracking-wide text-slate-400">
            {title}
          </p>
        </div>

        <div className="flex items-end justify-between">
          
          <h2 className="text-4xl font-bold tracking-tight text-white">
            {value}
          </h2>

          <div
            className="
              h-12 w-12 rounded-xl
              bg-blue-500/10
              border border-blue-500/20
              flex items-center justify-center
            "
          >
            <div className="h-2 w-2 rounded-full bg-blue-400" />
          </div>
        </div>
      </div>

      <div
        className="
          absolute inset-x-0 bottom-0 h-[2px]
          bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0
        "
      />
    </div>
  );
}

export default KPICard;